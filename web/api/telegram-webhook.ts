import { waitUntil } from "@vercel/functions";
import { verifyTelegramSecret } from "../lib/verify-signature.js";
import { callModal } from "../lib/modal-client.js";
import { sendTelegramMessage } from "../lib/telegram-client.js";
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

    const replyText = await callModal(message.text);
    await sendTelegramMessage(message.chat.id, replyText);
  } catch (err) {
    console.error("processMessage failed", err);
  }
}
