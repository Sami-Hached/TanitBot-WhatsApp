"""
This function is running on modal for inference.
Cold start: When called the first time, modal will spin up a container and run the startupt() function, then run inference.
Warm start: If a container already exists, the inference is run directly.
An example to call this modal function is in @call_command_r.py
"""
import modal

app = modal.App("command-r-transformers")

MODEL_ID = "CohereLabs/c4ai-command-r-v01-4bit"

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
class CommandR:
    @modal.enter()
    def startup(self):
        from transformers import AutoTokenizer, AutoModelForCausalLM

        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
        self.model = AutoModelForCausalLM.from_pretrained(MODEL_ID)

    @modal.method()
    def generate(self, messages: list[dict], max_new_tokens: int = 512, temperature: float = 0.3):
        from threading import Thread
        from transformers import TextIteratorStreamer

        streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)

        inputs = self.tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_tensors="pt",
            return_dict=True,
        ).to(self.model.device)

        thread = Thread(
            target=self.model.generate,
            kwargs=dict(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=True,
                temperature=temperature,
                streamer=streamer,
            ),
        )
        thread.start()

        for new_text in streamer:
            yield new_text

        thread.join()


@app.local_entrypoint()
def main():
    messages = [{"role": "user", "content": "I was hacked, what should I do? Answer me only in Arabic."}]
    for token in CommandR().generate.remote_gen(messages):
        print(token, end="", flush=True)
    print()
