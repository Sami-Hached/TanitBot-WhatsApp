"""
This function is running on modal for inference.
Cold start: When called the first time, modal will spin up a container and run the startupt() function, then run inference.
Warm start: If a container already exists, the inference is run directly.
An example to call this modal function is in @call_command_r.py
"""
import queue
import threading
import time
from dataclasses import dataclass, field

import modal

app = modal.App("command-r-transformers")

MODEL_ID = "CohereLabs/c4ai-command-r-v01-4bit"
MAX_BATCH_SIZE = 5
MAX_BATCH_WAIT_SECONDS = 0.3

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch",
        "transformers>=4.39.1",
        "bitsandbytes",
        "accelerate",
    )
)

hf_cache_volume = modal.Volume.from_name("huggingface-command-r", create_if_missing=True)


@dataclass
class GenerationRequest:
    messages: list
    max_new_tokens: int
    temperature: float
    out_queue: queue.Queue = field(default_factory=queue.Queue)


@app.cls(
    image=image,
    gpu="A100-40GB",
    cpu=1,
    memory=1024,
    secrets=[modal.Secret.from_name("huggingface-secret")],
    volumes={"/root/.cache/huggingface": hf_cache_volume},
    scaledown_window=10 * 60,
    timeout=30 * 60,
    max_containers=1,
)
@modal.concurrent(max_inputs=MAX_BATCH_SIZE)
class CommandR:
    @modal.enter()
    def startup(self):
        from transformers import AutoTokenizer, AutoModelForCausalLM
        from transformers.generation.streamers import BaseStreamer

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        if self.tokenizer.pad_token_id is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        self.tokenizer.padding_side = "left"

        self.model = AutoModelForCausalLM.from_pretrained(MODEL_ID)

        class BatchStreamer(BaseStreamer):
            def __init__(self, tokenizer, batch_size, skip_special_tokens=True):
                self.tokenizer = tokenizer
                self.skip_special_tokens = skip_special_tokens
                self.queues = [queue.Queue() for _ in range(batch_size)]
                self.token_caches = [[] for _ in range(batch_size)]
                self.print_lens = [0 for _ in range(batch_size)]
                # generate()'s first put() call carries the full prompt, not a
                # generated token; every call after that carries one new token per row.
                self.next_call_is_prompt = True

            def put(self, value):
                if self.next_call_is_prompt:
                    self.next_call_is_prompt = False
                    return
                for i, new_ids in enumerate(value.tolist()):
                    self.token_caches[i].extend(
                        new_ids if isinstance(new_ids, list) else [new_ids]
                    )
                    text = self.tokenizer.decode(
                        self.token_caches[i], skip_special_tokens=self.skip_special_tokens
                    )
                    new_text = text[self.print_lens[i]:]
                    if new_text:
                        self.queues[i].put(new_text)
                        self.print_lens[i] = len(text)

            def end(self):
                for q in self.queues:
                    q.put(None)

        self.BatchStreamer = BatchStreamer

        self.pending: queue.Queue[GenerationRequest] = queue.Queue()
        threading.Thread(target=self._batch_worker, daemon=True).start()

    def _batch_worker(self):
        while True:
            batch = [self.pending.get()]
            deadline = time.monotonic() + MAX_BATCH_WAIT_SECONDS
            while len(batch) < MAX_BATCH_SIZE:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    break
                try:
                    batch.append(self.pending.get(timeout=remaining))
                except queue.Empty:
                    break
            self._run_batch(batch)

    def _run_batch(self, batch):
        prompts = [
            self.tokenizer.apply_chat_template(
                req.messages, tokenize=False, add_generation_prompt=True
            )
            for req in batch
        ]
        inputs = self.tokenizer(
            prompts, return_tensors="pt", padding=True, add_special_tokens=False
        ).to(self.model.device)

        streamer = self.BatchStreamer(self.tokenizer, batch_size=len(batch))

        gen_thread = threading.Thread(
            target=self.model.generate,
            kwargs=dict(
                **inputs,
                max_new_tokens=max(req.max_new_tokens for req in batch),
                do_sample=True,
                # generate() takes one sampling config per batched call, so requests
                # sharing a batch window are generated with the first request's temperature.
                temperature=batch[0].temperature,
                streamer=streamer,
            ),
        )
        gen_thread.start()

        relay_threads = [
            threading.Thread(target=self._relay, args=(streamer.queues[i], req.out_queue))
            for i, req in enumerate(batch)
        ]
        for t in relay_threads:
            t.start()

        gen_thread.join()
        for t in relay_threads:
            t.join()

    @staticmethod
    def _relay(src_queue, dst_queue):
        while True:
            item = src_queue.get()
            dst_queue.put(item)
            if item is None:
                return

    def _generate_stream(self, messages: list[dict], max_new_tokens: int = 512, temperature: float = 0.3):
        req = GenerationRequest(messages=messages, max_new_tokens=max_new_tokens, temperature=temperature)
        self.pending.put(req)
        while True:
            item = req.out_queue.get()
            if item is None:
                break
            yield item

    @modal.method()
    def generate(self, messages: list[dict], max_new_tokens: int = 512, temperature: float = 0.3):
        yield from self._generate_stream(messages, max_new_tokens, temperature)

    @modal.method()
    def generate_sync(self, messages: list[dict], max_new_tokens: int = 512, temperature: float = 0.3) -> str:
        return "".join(self._generate_stream(messages, max_new_tokens, temperature))


@app.local_entrypoint()
def main():
    messages = [{"role": "user", "content": "I was hacked, what should I do? Answer me only in Arabic."}]
    for token in CommandR().generate.remote_gen(messages):
        print(token, end="", flush=True)
    print()
