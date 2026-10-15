import { ModalClient } from "modal";
import type { ChatMessage } from "./types.js";

const APP_NAME = "command-r-transformers";
const CLASS_NAME = "CommandR";

let client: ModalClient | null = null;
let clsPromise: any = null;

function getCls() {
  if (!client) {
    client = new ModalClient();
  }
  if (!clsPromise) {
    clsPromise = client.cls.fromName(APP_NAME, CLASS_NAME);
  }
  return clsPromise;
}

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
