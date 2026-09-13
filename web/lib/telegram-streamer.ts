import {
  TelegramApiError,
  editTelegramMessage,
  sendChatAction,
  sendTelegramMessage,
} from "./telegram-client.js";

/** The typing status expires after ~5s, so refresh inside that window. */
const TYPING_REFRESH_MS = 4000;
/** Telegram tolerates a few edits/sec per message; this leaves comfortable margin. */
const MIN_EDIT_INTERVAL_MS = 1200;
/** Avoids spending an edit on a handful of new characters. */
const MIN_DELTA_CHARS = 40;
/** Telegram's hard limit is 4096; leave room for the error suffix. */
const MAX_MESSAGE_CHARS = 3900;
/** Vercel kills the function at maxDuration (300s) without running catch/finally. */
const DEFAULT_DEADLINE_MS = 280_000;

const ERROR_SUFFIX = "\n\n⚠️ تعذّر إكمال الإجابة. عاود ابعث سؤالك من فضلك.";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface StreamRenderOptions {
  minEditIntervalMs?: number;
  minDeltaChars?: number;
  deadlineMs?: number;
}

function startTyping(chatId: number): () => void {
  const tick = () => void sendChatAction(chatId).catch(() => {});
  tick();
  const handle = setInterval(tick, TYPING_REFRESH_MS);
  return () => clearInterval(handle);
}

/**
 * Renders a token stream into a Telegram chat: a typing indicator while nothing has
 * arrived, then one message progressively edited as text accumulates.
 *
 * Throws only if nothing was ever shown to the user — that is the caller's signal to
 * fall back to the non-streaming path. Once any text is on screen, failures are
 * rendered in place instead, so the user is never left with a half-answer that looks
 * complete and never gets the same answer twice.
 */
export async function renderStreamToTelegram(
  chatId: number,
  stream: AsyncIterable<string>,
  onDeadline: () => void,
  opts: StreamRenderOptions = {}
): Promise<void> {
  const minDeltaChars = opts.minDeltaChars ?? MIN_DELTA_CHARS;
  let editInterval = opts.minEditIntervalMs ?? MIN_EDIT_INTERVAL_MS;

  let full = "";
  /** Characters already finalised into earlier messages, once the text overflows. */
  let committed = 0;
  let messageId: number | null = null;
  let lastRendered = "";
  let lastEditAt = 0;

  const visible = () => full.slice(committed);

  const stopTyping = startTyping(chatId);
  // Fires even if the stream hangs, unlike a check between deltas. Aborting the
  // fetch surfaces here as a rejection, so we fail inside our own control rather
  // than being executed mid-sentence by the platform.
  const deadlineTimer = setTimeout(onDeadline, opts.deadlineMs ?? DEFAULT_DEADLINE_MS);

  /** Single edit attempt. Returns false if a 429 made us skip this window. */
  async function tryEdit(text: string): Promise<boolean> {
    try {
      await editTelegramMessage(chatId, messageId!, text);
      lastRendered = text;
      lastEditAt = Date.now();
      return true;
    } catch (err) {
      if (err instanceof TelegramApiError && err.status === 429) {
        const retryAfterMs = (err.retryAfter ?? 1) * 1000;
        // Back off *and* widen the window, so we don't immediately re-offend and
        // escalate the cooldown. The rejected text is stale by now; drop it and let
        // the next window render whatever is current.
        editInterval = Math.max(editInterval * 1.5, retryAfterMs);
        await sleep(retryAfterMs + 500);
        return false;
      }
      throw err;
    }
  }

  /** Splits into a new message when the current one would exceed Telegram's limit. */
  async function rollover(): Promise<void> {
    while (full.length - committed > MAX_MESSAGE_CHARS) {
      const window = full.slice(committed, committed + MAX_MESSAGE_CHARS);
      const breakAt = Math.max(window.lastIndexOf("\n"), window.lastIndexOf(" "));
      const cut = breakAt > 0 ? breakAt : MAX_MESSAGE_CHARS;

      const head = full.slice(committed, committed + cut);
      // Retry rather than drop: advancing past text that never rendered would
      // silently lose it from the conversation entirely.
      if (!(await tryEdit(head))) await tryEdit(head);
      committed += cut;

      const rest = visible().trimStart();
      messageId = await sendTelegramMessage(chatId, rest || "…");
      lastRendered = rest || "…";
      lastEditAt = Date.now();
    }
  }

  /** Returns false only when a 429 skipped the write and it is worth retrying. */
  async function render(force: boolean): Promise<boolean> {
    await rollover();
    const text = visible();
    if (!text.trim() || text === lastRendered) return true;
    if (!force) {
      if (Date.now() - lastEditAt < editInterval) return true;
      if (text.length - lastRendered.length < minDeltaChars) return true;
    }
    // Awaited, never fire-and-forget: Telegram does not order concurrent edits, so
    // an older shorter body can land after a newer one and the text visibly rewinds.
    // Serialising also guarantees nothing is in flight when the loop exits, which is
    // what makes the final render below sufficient.
    return tryEdit(text);
  }

  try {
    for await (const delta of stream) {
      full += delta;

      if (messageId === null) {
        // Telegram rejects empty text, so wait for something substantive.
        if (!full.trim()) continue;
        stopTyping();
        messageId = await sendTelegramMessage(chatId, full);
        lastRendered = full;
        lastEditAt = Date.now();
        continue;
      }

      await render(false);
    }

    // A stream that completed without producing anything would otherwise leave the
    // user in silence, with no error for the caller to fall back from.
    if (messageId === null) throw new Error("stream produced no text");

    // The tail generated inside the last throttle window would otherwise be lost,
    // leaving a silently truncated answer on screen.
    for (let attempt = 0; attempt < 3; attempt++) {
      if (visible() === lastRendered) break;
      if (await render(true)) break;
    }
  } catch (err) {
    if (messageId === null) throw err; // nothing shown yet — caller can fall back
    // Keep whatever arrived, but mark it incomplete. A truncated safety instruction
    // presented as a finished answer is the worst outcome this bot can produce.
    const partial = visible().slice(0, MAX_MESSAGE_CHARS);
    await tryEdit(partial + ERROR_SUFFIX).catch(() => {});
  } finally {
    clearTimeout(deadlineTimer);
    stopTyping();
  }
}
