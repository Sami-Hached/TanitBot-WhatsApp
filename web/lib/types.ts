export interface WhatsAppTextMessage {
  from: string;
  type: string;
  text?: { body: string };
}

export interface WhatsAppWebhookValue {
  metadata: { phone_number_id: string };
  messages?: WhatsAppTextMessage[];
}

export interface WhatsAppWebhookPayload {
  entry?: Array<{
    changes?: Array<{ value?: WhatsAppWebhookValue }>;
  }>;
}

export interface TelegramMessage {
  chat: { id: number };
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}
