// Throwaway script to verify the Modal JS SDK can call CommandR.generate_sync
// before relying on it inside the webhook handler (lib/modal-client.ts).
//
// Requires MODAL_TOKEN_ID / MODAL_TOKEN_SECRET in the environment, and
// `modal deploy modal_transformers_app.py` already run from the repo root.
//
// Run from web/: node spike-modal-sdk.mjs "your test prompt"

import { ModalClient } from "modal";

const prompt = process.argv[2] ?? "Say hello in one short sentence.";

const client = new ModalClient();
const cls = await client.cls.fromName("command-r-transformers", "CommandR");
const obj = await cls.instance({});
const generateSync = obj.method("generate_sync");

console.log("Calling generate_sync...");
const start = Date.now();

const result = await generateSync.remote([
  [{ role: "user", content: prompt }],
  128,
  0.3,
]);

console.log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s:`);
console.log(result);
