const NOT_MODIFIED = "message is not modified";

export class TelegramApiError extends Error {
  readonly method: string;
  readonly status: number;
  readonly description: string;
  /** Seconds Telegram asked us to wait, from a 429's parameters.retry_after. */
  readonly retryAfter?: number;
  /** Telegram rejects an edit whose text is byte-identical to the current text. */
  readonly notModified: boolean;

  constructor(method: string, status: number, description: string, retryAfter?: number) {
    super(`Telegram ${method} failed ${status}: ${description}`);
    this.name = "TelegramApiError";
    this.method = method;
    this.status = status;
    this.description = description;
    this.retryAfter = retryAfter;
    this.notModified = description.toLowerCase().includes(NOT_MODIFIED);
  }
}

async function callTelegram<T>(method: string, body: unknown): Promise<T> {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let payload: { ok?: boolean; result?: T; description?: string; parameters?: { retry_after?: number } };
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new TelegramApiError(method, res.status, raw.slice(0, 300));
  }

  // Telegram can answer 200 OK with {"ok": false, ...}, so res.ok alone would let
  // real failures through as successes.
  if (!res.ok || !payload.ok) {
    throw new TelegramApiError(
      method,
      res.status,
      payload.description ?? raw.slice(0, 300),
      payload.parameters?.retry_after
    );
  }

  return payload.result as T;
}

/** Sends a message and returns its message_id, so callers can edit it afterwards. */
export async function sendTelegramMessage(chatId: number, text: string): Promise<number> {
  const result = await callTelegram<{ message_id: number }>("sendMessage", {
    chat_id: chatId,
    text,
  });
  return result.message_id;
}

/**
 * Edits a previously sent message. An identical-text edit is treated as success:
 * Telegram reports it as an error, but it means the message already says what we want.
 */
export async function editTelegramMessage(
  chatId: number,
  messageId: number,
  text: string
): Promise<void> {
  try {
    await callTelegram("editMessageText", { chat_id: chatId, message_id: messageId, text });
  } catch (err) {
    if (err instanceof TelegramApiError && err.notModified) return;
    throw err;
  }
}

/**
 * Shows the "typing…" status. It expires after ~5s and is cleared as soon as the bot
 * sends a message, so it has to be re-sent to persist across a long wait.
 * Purely cosmetic — never let a failure here break a reply.
 */
export async function sendChatAction(chatId: number, action = "typing"): Promise<void> {
  await callTelegram("sendChatAction", { chat_id: chatId, action });
}
