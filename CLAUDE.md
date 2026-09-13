# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

TanitBot is an Arabic (Tunisian Derja) digital-safety assistant that answers user questions over
WhatsApp and Telegram. It is a RAG chatbot grounded in the PDF corpus under `RAG-files/`
(Tunisian/MENA digital-security and anti-cyberviolence guides).

## Two deployment targets

The repo holds two independently deployed halves that must be deployed separately:

| Half | Path | Deployed to | Deploy command |
|---|---|---|---|
| GPU inference + RAG | repo root (`modal_transformers_app.py`, `rag.py`, `RAG-files/`) | Modal | `modal deploy modal_transformers_app.py` |
| Webhook mediator | `web/` | Vercel (Root Directory set to `web`) | Vercel git deploy |

They are coupled by two separate, equally silent contracts — there is no shared type or
build-time check across either:

1. **SDK path** — the Modal app/class names `"command-r-transformers"` / `"CommandR"` and the
   `generate_sync` signature `(messages, max_new_tokens, temperature)`. Renaming any of them
   requires an edit in `web/lib/modal-client.ts` (and `call_command_r.py`, `web/spike-modal-sdk.mjs`).
2. **Streaming path** — the `stream_http` web endpoint URL (`MODAL_STREAM_URL`) and its SSE frame
   format (`{"delta"}` / `{"done"}` / `{"error"}`), consumed by `web/lib/modal-stream-client.ts`.

## Request flow

1. Meta/Telegram POSTs a webhook to `web/api/{whatsapp,telegram}-webhook.ts`.
2. The handler verifies the signature (`lib/verify-signature.ts`: Meta HMAC-SHA256 over the **raw
   body**, so WhatsApp must read `request.text()` before parsing; Telegram compares the
   `X-Telegram-Bot-Api-Secret-Token` header) and returns 200 **immediately**,
   handing slow work to `waitUntil(...)`. Platforms retry on a slow response, so never `await` the
   model call first — a retried Telegram update means a second reply and a second GPU generation.
3. **Telegram streams**: `lib/modal-stream-client.ts` opens the `stream_http` SSE endpoint and
   `lib/telegram-streamer.ts` sends one message then progressively edits it, with a
   `sendChatAction` typing indicator covering the pre-first-token wait. On any stream failure it
   falls back to the SDK path, so the streaming path is strictly an upgrade.
4. **WhatsApp never streams**: the Cloud API has no edit-message endpoint. It calls
   `lib/modal-client.ts` → `generate_sync` and sends one message.

Why streaming needs a web endpoint at all: the Modal **JS** SDK cannot consume Python generators
(`Function` exposes only `remote()`/`spawn()`, both single-value; verified through `modal@0.10.1`),
so `CommandR.generate` is unreachable from TypeScript. HTTP is the way around it.

`maxDuration: 300` is set in both `web/vercel.json` and as an exported `config` in each handler;
300s is Vercel's cap and is needed because a Modal cold start (container boot + 35B 4-bit model
load) can take minutes.

## Modal side (`modal_transformers_app.py`)

- `CommandR` is a `@app.cls` with `gpu="A100-40GB"`, `max_containers=1`, `scaledown_window=10min`.
- `@modal.concurrent(max_inputs=5)` lets one container accept 5 concurrent requests; a background
  `_batch_worker` thread collects them into a batch (up to `MAX_BATCH_SIZE`, waiting at most
  `MAX_BATCH_WAIT_SECONDS`) and runs a single `model.generate()`. `BatchStreamer` demultiplexes the
  batched token stream back into one queue per request, closing each row's queue as soon as that
  row hits EOS (`generate()` runs until the longest row finishes, so without this a short reply
  would stream fully and then sit open until the rest of the batch caught up).
  - Known consequence: `generate()` takes one sampling config per call, so every request in a batch
    is generated with **the first request's temperature** and the batch's max `max_new_tokens`.
- Three entry points, all funnelling into the same private `_generate_stream`:
  - `generate` — `@modal.method()` generator; `call_command_r.py` and the local entrypoint.
  - `generate_sync` — joins the stream into one string; WhatsApp and Telegram's fallback.
  - `stream_http` — `@modal.fastapi_endpoint` returning SSE; Telegram's streaming path.
    `media_type="text/event-stream"` is required (Modal only guarantees unbuffered delivery for
    it), and `requires_proxy_auth=True` is enforced at ingress *before* the container starts, so
    an unauthenticated request can't cold-start the A100.
- The image is deliberately split into two `uv_pip_install` layers so touching the RAG deps doesn't
  invalidate the slow torch layer. Keep that split when adding dependencies.
- Two Modal volumes: `huggingface-command-r` (model weights cache) and `rag-index-cache` (FAISS
  index). Requires the `huggingface-secret` Modal secret.

## RAG (`rag.py`)

- `build_or_load_index` rebuilds the FAISS index only when the **set of PDF filenames** under
  `RAG-files/` differs from what's in the cached `chunks_metadata.json` — mtimes are ignored because
  mounted files always look fresh. Editing a PDF's *contents* without renaming it will NOT trigger a
  rebuild; bump the filename or clear the `rag-index-cache` volume.
- `startup()` commits `rag_index_volume` only when `was_rebuilt` is true.
- The embedding model (`paraphrase-multilingual-MiniLM-L12-v2`) is pinned to CPU on purpose so it
  doesn't take GPU memory from the 35B model.
- `SYSTEM_INSTRUCTION` is a long Arabic prompt that is the product spec: safety rules for handling
  sextortion/digital-violence cases, Tunisian-Derja-only output, mandatory
  `[المصدر: اسم_المصدر، صفحة X]` citations, and a hard 3-bullet answer limit. Treat changes to it as
  behavior changes, not copy edits.
- `_SOURCE_NAME_MAP` maps PDF filenames to the human-readable Arabic source names the model is told
  to cite verbatim. **Adding a PDF to `RAG-files/` without adding an entry here** falls back to a
  de-slugged filename in citations.
- `build_rag_messages` injects the system prompt and rewrites the last user message to embed the
  retrieved context; earlier turns are passed through untouched.

## Commands

```bash
# Modal (from repo root; needs `modal setup` once)
modal deploy modal_transformers_app.py      # deploy
modal run modal_transformers_app.py         # deploy-less test via local_entrypoint
python call_command_r.py                    # call the already-deployed class, streaming

# Web (from web/)
npm install
npm run typecheck                           # tsc --noEmit — the only check that exists
npx vercel env pull                         # pull env vars for local dev
npm run dev                                 # vercel dev
node spike-modal-sdk.mjs "prompt"           # exercise the Modal SDK path alone
node spike-modal-stream.mjs "prompt"        # exercise the SSE path; reports frame pacing / 303s
```

There is no test suite, linter, or formatter in this repo. `npm run typecheck` is the only
verification step for `web/`; the Python side has none.

## Conventions / gotchas

- Python: requires 3.14 locally (`uv`, `pyproject.toml`), but the Modal **image** is Python 3.11.
  Heavy imports (`torch`, `faiss`, `pypdf`, `sentence_transformers`) live inside functions/methods
  so the local process never needs them installed.
- `web/` is ESM (`"type": "module"`, `moduleResolution: NodeNext`): relative imports must carry the
  `.js` extension even for `.ts` sources.
- Both Modal clients pass only the single latest user message — there is no conversation history or
  per-user session state anywhere in the system, even though `generate_sync`/`stream_http` accept a
  full `messages` list.
- Telegram replies are **plain text, never `parse_mode`**. Partially-streamed Markdown (an unclosed
  `*`, or the mandated `[المصدر: …، صفحة X]` citation, which opens a Markdown link) makes Telegram
  reject the edit and the message silently stops updating.
- Telegram handles `/start` locally with a hardcoded `INTRO_MESSAGE`; WhatsApp has no equivalent.
- All secrets live in Vercel env vars and the Modal `huggingface-secret`; `web/README.md` documents
  each variable and the webhook registration steps for both platforms.
