// Non-streaming path, over the Modal SDK. Used by the WhatsApp webhook — whose Cloud
// API has no edit-message capability, so it can never stream — and as the Telegram
// webhook's fallback when the SSE endpoint is unavailable. Do not merge this with
// modal-stream-client.ts: different transport, different auth, different failure modes.
import { ModalClient } from "modal";

const APP_NAME = "command-r-transformers";
const CLASS_NAME = "CommandR";

const client = new ModalClient();

let clsPromise: ReturnType<typeof client.cls.fromName> | null = null;

function getCls() {
  if (!clsPromise) {
    clsPromise = client.cls.fromName(APP_NAME, CLASS_NAME);
  }
  return clsPromise;
}

import type { ChatMessage } from "./types.js";

export async function callModal(input: string | ChatMessage[]): Promise<string> {
  const cls = await getCls();
  const obj = await cls.instance({});
  const generateSync = obj.method("generate_sync");
  const messages = typeof input === "string" ? [{ role: "user" as const, content: input }] : input;

  const result = await generateSync.remote([
    messages,
    512,
    0.3,
  ]);

  return result as string;
}
