import { waitUntil } from "@vercel/functions";
import { verifyMetaSignature } from "../lib/verify-signature.js";
import { callModal } from "../lib/modal-client.js";
import { sendWhatsAppMessage } from "../lib/whatsapp-client.js";
import type { WhatsAppWebhookPayload } from "../lib/types.js";

export const config = { maxDuration: 800 };

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature, process.env.WHATSAPP_APP_SECRET!)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload: WhatsAppWebhookPayload = JSON.parse(rawBody);
  waitUntil(processMessage(payload));

  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function processMessage(payload: WhatsAppWebhookPayload): Promise<void> {
  const value = payload.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message || message.type !== "text" || !message.text) return;

  try {
    const replyText = await callModal(message.text.body);
    await sendWhatsAppMessage(value!.metadata.phone_number_id, message.from, replyText);
  } catch (err) {
    console.error("processMessage failed", err);
  }
}
