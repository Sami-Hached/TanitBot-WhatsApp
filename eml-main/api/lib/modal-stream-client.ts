import { ModalClient } from "modal";
import type { ChatMessage } from "./types.js";

const APP_NAME = "command-r-transformers";
const CLASS_NAME = "CommandR";
const METHOD_NAME = "stream_http";
const DEFAULT_STREAM_URL = "https://tanitbot--command-r-transformers-commandr-stream-http.modal.run";

export class ModalStreamUnavailable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModalStreamUnavailable";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ModalStreamUnavailable(`${name} is not set in environment variables`);
  return value;
}

let streamUrlPromise: Promise<string> | null = null;

function getStreamUrl(): Promise<string> {
  const override = process.env.MODAL_STREAM_URL || DEFAULT_STREAM_URL;
  if (override) return Promise.resolve(override);

  if (!streamUrlPromise) {
    streamUrlPromise = (async () => {
      const cls = await new ModalClient().cls.fromName(APP_NAME, CLASS_NAME);
      const instance = await cls.instance({});
      const url = await instance.method(METHOD_NAME).getWebUrl();
      if (!url) {
        throw new ModalStreamUnavailable(
          `${CLASS_NAME}.${METHOD_NAME} is not a web endpoint — is the deployed Modal app current?`
        );
      }
      return url;
    })().catch((err) => {
      streamUrlPromise = null;
      throw err instanceof ModalStreamUnavailable
        ? err
        : new ModalStreamUnavailable(`could not resolve ${METHOD_NAME} URL: ${err}`);
    });
  }
  return streamUrlPromise;
}

export async function* streamModal(
  input: string | ChatMessage[],
  signal?: AbortSignal
): AsyncGenerator<string, void, void> {
  const messages = typeof input === "string" ? [{ role: "user" as const, content: input }] : input;
  const streamUrl = await getStreamUrl();

  const res = await fetch(streamUrl, {
    method: "POST",
    signal,
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "Modal-Key": requireEnv("MODAL_PROXY_TOKEN_ID"),
      "Modal-Secret": requireEnv("MODAL_PROXY_TOKEN_SECRET"),
    },
    body: JSON.stringify({
      messages,
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

    throw new Error("Modal stream ended without a completion event");
  } finally {
    await reader.cancel().catch(() => {});
  }
}
