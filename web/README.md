# WhatsApp → Modal webhook

Vercel-deployed Node.js app that receives WhatsApp Cloud API webhooks, forwards the
message text to the deployed `CommandR.generate_sync` Modal method, and replies via
the WhatsApp Graph API. See the repo-root `modal_transformers_app.py` for the model
side.

## Environment variables

Set these in Vercel project settings (Settings → Environment Variables) — do not
commit a `.env` file.

| Variable | Purpose |
|---|---|
| `MODAL_TOKEN_ID` | Modal workspace API token ID — auth for the Modal JS SDK call |
| `MODAL_TOKEN_SECRET` | Modal workspace API token secret |
| `WHATSAPP_VERIFY_TOKEN` | Arbitrary string you choose; must match the "Verify Token" set in Meta App Dashboard → WhatsApp → Configuration → Webhook |
| `WHATSAPP_APP_SECRET` | Meta App Secret — verifies the `X-Hub-Signature-256` header on incoming webhooks |
| `WHATSAPP_ACCESS_TOKEN` | Permanent WhatsApp Business system-user access token — bearer token for sending replies |

For local development with `vercel dev`, run `vercel env pull` after setting these in
the dashboard, or export them in your shell before starting the dev server.

## Deploying

In the Vercel project settings, set **Root Directory** to `web` so Vercel only builds
this subfolder — the Python/Modal code at the repo root is untouched by this deploy.

## Setup checklist

1. `modal deploy modal_transformers_app.py` (from the repo root) to publish `generate_sync`.
2. `modal token new` (or the Modal dashboard) to get `MODAL_TOKEN_ID`/`MODAL_TOKEN_SECRET`.
3. Set all five env vars above in the Vercel project.
4. Deploy, then paste the resulting `/api/whatsapp-webhook` URL and your `WHATSAPP_VERIFY_TOKEN`
   into Meta App Dashboard → WhatsApp → Configuration → Webhook, and subscribe to the
   `messages` field.
