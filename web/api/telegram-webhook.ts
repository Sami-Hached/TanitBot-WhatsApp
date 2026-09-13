import { waitUntil } from "@vercel/functions";
import { verifyTelegramSecret } from "../lib/verify-signature.js";
import { callModal } from "../lib/modal-client.js";
import { streamModal } from "../lib/modal-stream-client.js";
import { sendTelegramMessage } from "../lib/telegram-client.js";
import { renderStreamToTelegram } from "../lib/telegram-streamer.js";
import type { TelegramUpdate } from "../lib/types.js";

export const config = { maxDuration: 300 };

const INTRO_MESSAGE = `أهلا بيك! أنا TanitBot 🤝

مساعد رقمي نجم نعاونك في مسائل السلامة الرقمية والأمن السيبراني، وخاصة الحماية من العنف الرقمي والابتزاز الالكتروني.

نقدر نعاونك في:
• حماية حسابتك على فيسبوك، انستغرام، وباقي مواقع التواصل الاجتماعي
• خطوات آمنة للتعامل مع التحرش أو الابتزاز الرقمي
• نصائح عملية للحفاظ على خصوصيتك أونلاين

اطرح سؤالك بكل حرية، وباش نجاوبك بالدارجة التونسية.`;

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
    if (message.text.split(" ")[0] === "/start") {
      await sendTelegramMessage(message.chat.id, INTRO_MESSAGE);
      return;
    }

    await streamReply(message.chat.id, message.text);
  } catch (err) {
    console.error("processMessage failed", err);
  }
}

/**
 * Streams the answer in place, falling back to a single non-streaming reply if the
 * stream never produced anything — a cold start can outlive Modal's 150s ingress
 * timeout, and the SDK path has no such limit. The fallback means the streaming path
 * is strictly an upgrade: the worst case is the behaviour we had before it existed.
 */
async function streamReply(chatId: number, text: string): Promise<void> {
  const controller = new AbortController();
  try {
    await renderStreamToTelegram(chatId, streamModal(text, controller.signal), () =>
      controller.abort()
    );
  } catch (err) {
    console.error("streaming reply failed, falling back to generate_sync", err);
    await sendTelegramMessage(chatId, await callModal(text));
  }
}
