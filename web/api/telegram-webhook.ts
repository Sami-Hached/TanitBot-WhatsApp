import { waitUntil } from "@vercel/functions";
import { verifyTelegramSecret } from "../lib/verify-signature.js";
import { callModal } from "../lib/modal-client.js";
import { sendTelegramMessage } from "../lib/telegram-client.js";
import type { TelegramUpdate } from "../lib/types.js";

export const config = { maxDuration: 300 };

export async function POST(request: Request): Promise<Response> {
  const secretHeader = request.headers.get("x-telegram-bot-api-secret-token");
  if (!verifyTelegramSecret(secretHeader, process.env.TELEGRAM_WEBHOOK_SECRET!)) {
    return new Response("Invalid secret token", { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;
  waitUntil(processMessage(update));

  return new Response("OK", { status: 200 });
}

async function processMessage(update: TelegramUpdate): Promise<void> {
  const message = update.message;
  if (!message?.text) return;

  try {
    const replyText = await callModal(message.text);
    await sendTelegramMessage(message.chat.id, replyText);
  } catch (err) {
    console.error("processMessage failed", err);
  }
}
