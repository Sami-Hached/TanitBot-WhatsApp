# WhatsApp / Telegram → Modal webhook

Vercel-deployed Node.js app that receives WhatsApp Cloud API and Telegram Bot API
webhooks, forwards the message text to the deployed Modal `CommandR` class, and replies
via each platform's send-message API. See the repo-root `modal_transformers_app.py` for
the model side. The two platforms are separate endpoints (`api/whatsapp-webhook.ts`,
`api/telegram-webhook.ts`).

Telegram **streams** its reply: `lib/modal-stream-client.ts` consumes the
`CommandR.stream_http` SSE endpoint and `lib/telegram-streamer.ts` progressively edits
one message as tokens arrive, showing a typing indicator until the first token. If the
stream is unavailable — most likely a cold start outliving Modal's 150s ingress timeout
— it falls back to the non-streaming `lib/modal-client.ts` (`generate_sync`) path.

WhatsApp always uses `lib/modal-client.ts`: the Cloud API has no edit-message
capability, so a reply there cannot be revealed progressively.

## Environment variables

Set these in Vercel project settings (Settings → Environment Variables) — do not
commit a `.env` file.

| Variable | Purpose |
|---|---|
| `MODAL_TOKEN_ID` | Modal workspace API token ID — auth for the Modal JS SDK call |
| `MODAL_TOKEN_SECRET` | Modal workspace API token secret |
| `MODAL_STREAM_URL` | URL of the deployed `CommandR.stream_http` web endpoint — printed by `modal deploy`, or `modal app list` |
| `MODAL_PROXY_TOKEN_ID` | Modal **proxy auth** token ID — gates the streaming endpoint. Not the same as `MODAL_TOKEN_ID` (see below) |
| `MODAL_PROXY_TOKEN_SECRET` | Modal proxy auth token secret |
| `WHATSAPP_VERIFY_TOKEN` | Arbitrary string you choose; must match the "Verify Token" set in Meta App Dashboard → WhatsApp → Configuration → Webhook |
| `WHATSAPP_APP_SECRET` | Meta App Secret — verifies the `X-Hub-Signature-256` header on incoming webhooks |
| `WHATSAPP_ACCESS_TOKEN` | Permanent WhatsApp Business system-user access token — bearer token for sending replies |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather — used for both `sendMessage` calls and the one-time `setWebhook` registration |
| `TELEGRAM_WEBHOOK_SECRET` | Arbitrary string you choose; passed to `setWebhook`'s `secret_token` param, checked against the incoming `X-Telegram-Bot-Api-Secret-Token` header |

For local development with `vercel dev`, run `vercel env pull` after setting these in
the dashboard, or export them in your shell before starting the dev server.

### Proxy auth tokens are not workspace tokens

`MODAL_PROXY_TOKEN_ID`/`SECRET` are a **separate, narrower credential** from
`MODAL_TOKEN_ID`/`SECRET`. Workspace tokens grant full API access to the whole Modal
workspace; a proxy token only permits calling a web endpoint. Create one with:

```bash
modal workspace proxy-tokens create
```

(or in the Modal dashboard under Settings → Proxy Auth Tokens). Modal enforces them at
its ingress, so an unauthenticated request is rejected before it can cold-start the
A100 — which is why the streaming endpoint uses `requires_proxy_auth=True` rather than
checking a shared secret inside the function.

## Deploying

In the Vercel project settings, set **Root Directory** to `web` so Vercel only builds
this subfolder — the Python/Modal code at the repo root is untouched by this deploy.

## Setup checklist

1. `modal deploy modal_transformers_app.py` (from the repo root) to publish `generate_sync`.
2. `modal token new` (or the Modal dashboard) to get `MODAL_TOKEN_ID`/`MODAL_TOKEN_SECRET`.
3. Set all env vars above in the Vercel project.
4. Deploy.
5. **WhatsApp**: paste the resulting `/api/whatsapp-webhook` URL and your `WHATSAPP_VERIFY_TOKEN`
   into Meta App Dashboard → WhatsApp → Configuration → Webhook, and subscribe to the
   `messages` field.
6. **Telegram**: register the webhook with a single API call (no dashboard needed):
   ```bash
   curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
     -d "url=https://<your-vercel-domain>/api/telegram-webhook" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```
