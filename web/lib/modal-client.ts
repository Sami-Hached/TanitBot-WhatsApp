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

export async function callModal(userText: string): Promise<string> {
  const cls = await getCls();
  const obj = await cls.instance({});
  const generateSync = obj.method("generate_sync");

  const result = await generateSync.remote([
    [{ role: "user", content: userText }],
    512,
    0.3,
  ]);

  return result as string;
}
