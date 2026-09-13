// Throwaway script to verify the streaming path before relying on it in the webhook
// (lib/modal-stream-client.ts), in the spirit of spike-modal-sdk.mjs.
//
// It answers the two questions docs cannot: do SSE frames actually arrive
// progressively rather than in one buffered burst, and does a COLD container make
// Modal's ingress return a 303 (its 150s timeout) instead of a stream?
//
// Requires MODAL_PROXY_TOKEN_ID / MODAL_PROXY_TOKEN_SECRET (plus the usual
// MODAL_TOKEN_ID / MODAL_TOKEN_SECRET the SDK uses to look the endpoint URL up), and
// `modal deploy modal_transformers_app.py` already run from the repo root.
// Set MODAL_STREAM_URL to pin a specific endpoint instead of resolving it.
//
// Run from web/:            node spike-modal-stream.mjs "your test prompt"
// For the cold-start case:  wait out scaledown_window (10 min), then run it again.

import { ModalClient } from "modal";

const prompt = process.argv[2] ?? "شنوة نعمل كان تسرق حسابي؟";

for (const name of ["MODAL_PROXY_TOKEN_ID", "MODAL_PROXY_TOKEN_SECRET"]) {
  if (!process.env[name]) {
    console.error(`Missing ${name} — create one with: modal workspace proxy-tokens create`);
    process.exit(1);
  }
}

const start = Date.now();
const at = () => `${((Date.now() - start) / 1000).toFixed(1)}s`;

let url = process.env.MODAL_STREAM_URL;
if (!url) {
  const cls = await new ModalClient().cls.fromName("command-r-transformers", "CommandR");
  url = await (await cls.instance({})).method("stream_http").getWebUrl();
  if (!url) {
    console.error("stream_http is not a web endpoint — redeploy modal_transformers_app.py");
    process.exit(1);
  }
  console.log(`[${at()}] resolved ${url}`);
}

const res = await fetch(url, {
  method: "POST",
  redirect: "manual",
  headers: {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
    "Modal-Key": process.env.MODAL_PROXY_TOKEN_ID,
    "Modal-Secret": process.env.MODAL_PROXY_TOKEN_SECRET,
  },
  body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
});

console.log(`[${at()}] status ${res.status}`);

if (res.status >= 300 && res.status < 400) {
  console.log("REDIRECT — cold start outlived the 150s ingress timeout.");
  console.log("Location:", res.headers.get("location"));
  console.log("The webhook falls back to generate_sync here.");
  process.exit(0);
}
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

const reader = res.body.getReader();
const decoder = new TextDecoder("utf-8");
let buffer = "";
let frames = 0;
let firstDeltaAt = null;
let text = "";

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });

  let sep;
  while ((sep = buffer.indexOf("\n\n")) !== -1) {
    const line = buffer.slice(0, sep).split("\n").find((l) => l.startsWith("data:"));
    buffer = buffer.slice(sep + 2);
    if (!line) continue;

    const event = JSON.parse(line.slice(5).trim());
    if (event.error) {
      console.error(`\n[${at()}] in-band error:`, event.error);
      process.exit(1);
    }
    if (event.done) {
      console.log(`\n\n[${at()}] done after ${frames} frames (first delta at ${firstDeltaAt}).`);
      console.log(
        frames > 3
          ? "Frames arrived incrementally — streaming works."
          : "Very few frames: output may be buffering. Check media_type."
      );
      process.exit(0);
    }
    if (event.delta) {
      firstDeltaAt ??= at();
      frames++;
      text += event.delta;
      process.stdout.write(event.delta);
    }
  }
}

console.error(`\n[${at()}] stream ended WITHOUT a done event after ${text.length} chars.`);
process.exit(1);
