export async function sendWhatsAppMessage(
  phoneNumberId: string,
  to: string,
  body: string
): Promise<void> {
  const res = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp send failed ${res.status}: ${await res.text()}`);
  }
}
