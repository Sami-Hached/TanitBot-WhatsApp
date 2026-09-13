/**
 * SSE client for CommandR.stream_http on Modal.
 *
 * Deliberately separate from modal-client.ts: that one uses the Modal SDK, is the
 * WhatsApp path (WhatsApp's Cloud API cannot edit messages, so it can never stream),
 * and is also this module's fallback. Merging the two would break WhatsApp.
 *
 * This exists because the Modal JS SDK has no remote_gen equivalent — Function only
 * exposes remote()/spawn(), both single-value — so CommandR.generate is unreachable
 * over the SDK and we go over plain HTTP instead.
 */

/** The stream could not be used; the caller should fall back to the non-streaming path. */
export class ModalStreamUnavailable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModalStreamUnavailable";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ModalStreamUnavailable(`${name} is not set`);
  return value;
}

export async function* streamModal(
  userText: string,
  signal?: AbortSignal
): AsyncGenerator<string, void, void> {
  const url = requireEnv("MODAL_STREAM_URL");

  const res = await fetch(url, {
    method: "POST",
    signal,
    // Modal answers a request that outlives its 150s ingress timeout — i.e. a slow
    // cold start — with a 303 to a result-polling URL. Following it would re-issue as
    // a bodiless GET (RFC 7231), silently dropping the prompt instead of failing, so
    // we intercept the redirect and let the caller degrade to the SDK path.
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "Modal-Key": requireEnv("MODAL_PROXY_TOKEN_ID"),
      "Modal-Secret": requireEnv("MODAL_PROXY_TOKEN_SECRET"),
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userText }],
      max_new_tokens: 512,
      temperature: 0.3,
    }),
  });

  if (res.status >= 300 && res.status < 400) {
    throw new ModalStreamUnavailable(
      `Modal redirected (${res.status}) — request outlived the ingress timeout, container likely cold`
    );
  }
  if (!res.ok) {
    throw new Error(`Modal stream failed ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  if (!res.body) {
    throw new Error("Modal stream returned no body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // stream:true is required, not defensive: Arabic is entirely multi-byte in
      // UTF-8, so a chunk boundary will eventually split a character. Decoding each
      // chunk independently yields replacement characters that read as a model bug.
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);

        const dataLine = frame.split("\n").find((line) => line.startsWith("data:"));
        if (!dataLine) continue;

        const event = JSON.parse(dataLine.slice("data:".length).trim()) as {
          delta?: string;
          done?: boolean;
          error?: string;
        };

        if (event.error) throw new Error(`Modal generation failed: ${event.error}`);
        if (event.done) return;
        if (event.delta) yield event.delta;
      }
    }

    // No done sentinel: the connection dropped mid-generation. Treat it as a failure
    // rather than silently presenting a truncated answer as complete.
    throw new Error("Modal stream ended without a completion event");
  } finally {
    await reader.cancel().catch(() => {});
  }
}
