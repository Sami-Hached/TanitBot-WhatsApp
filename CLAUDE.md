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

They are coupled *only* by the Modal app/class names `"command-r-transformers"` / `"CommandR"` and
the `generate_sync` method signature `(messages, max_new_tokens, temperature)`. Renaming the Modal
app, class, or method requires an edit in `web/lib/modal-client.ts` (and `call_command_r.py`,
`web/spike-modal-sdk.mjs`) or the webhooks break silently at runtime — there is no shared type or
build-time check across the boundary.

## Request flow

1. Meta/Telegram POSTs a webhook to `web/api/{whatsapp,telegram}-webhook.ts`.
2. The handler verifies the request signature (`lib/verify-signature.ts`: Meta HMAC-SHA256 over the
   **raw body** — so WhatsApp must read `request.text()` before parsing; Telegram compares the
   `X-Telegram-Bot-Api-Secret-Token` header).
3. It returns 200 **immediately** and hands the slow work to `waitUntil(processMessage(...))`.
   Platforms retry on slow responses, so never `await` the model call before responding.
4. `lib/modal-client.ts` calls the deployed Modal `CommandR.generate_sync` over the Modal JS SDK.
5. The reply is sent back via `lib/telegram-client.ts` / `lib/whatsapp-client.ts`.

`maxDuration: 300` is set in both `web/vercel.json` and as an exported `config` in each handler;
300s is Vercel's cap and is needed because a Modal cold start (container boot + 35B 4-bit model
load) can take minutes.

## Modal side (`modal_transformers_app.py`)

- `CommandR` is a `@app.cls` with `gpu="A100-40GB"`, `max_containers=1`, `scaledown_window=10min`.
- `@modal.concurrent(max_inputs=5)` lets one container accept 5 concurrent requests; a background
  `_batch_worker` thread collects them into a batch (up to `MAX_BATCH_SIZE`, waiting at most
  `MAX_BATCH_WAIT_SECONDS`) and runs a single `model.generate()`. `BatchStreamer` demultiplexes the
  batched token stream back into one queue per request.
  - Known consequence: `generate()` takes one sampling config per call, so every request in a batch
    is generated with **the first request's temperature** and the batch's max `max_new_tokens`.
- Two entry points: `generate` (a generator, streams tokens; used by `call_command_r.py` and the
  local entrypoint) and `generate_sync` (joins the stream into one string; used by the webhooks).
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
```

There is no test suite, linter, or formatter in this repo. `npm run typecheck` is the only
verification step for `web/`; the Python side has none.

## Conventions / gotchas

- Python: requires 3.14 locally (`uv`, `pyproject.toml`), but the Modal **image** is Python 3.11.
  Heavy imports (`torch`, `faiss`, `pypdf`, `sentence_transformers`) live inside functions/methods
  so the local process never needs them installed.
- `web/` is ESM (`"type": "module"`, `moduleResolution: NodeNext`): relative imports must carry the
  `.js` extension even for `.ts` sources.
- `callModal` currently passes only the single latest user message — there is no conversation
  history or per-user session state anywhere in the system, even though `generate_sync` accepts a
  full `messages` list.
- Telegram handles `/start` locally with a hardcoded `INTRO_MESSAGE`; WhatsApp has no equivalent.
- All secrets live in Vercel env vars and the Modal `huggingface-secret`; `web/README.md` documents
  each variable and the webhook registration steps for both platforms.
