import { verifyApiKey } from "../lib/verify-signature.js";
import { callModal } from "../lib/modal-client.js";
import { streamModal, ModalStreamUnavailable } from "../lib/modal-stream-client.js";
import type { ChatMessage } from "../lib/types.js";

export const config = { maxDuration: 300 };

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
};

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(): Promise<Response> {
  const authRequired = Boolean(process.env.CHAT_API_KEY);
  return new Response(
    JSON.stringify({
      status: "ok",
      bot: "TanitBot",
      endpoint: "/api/chat",
      authRequired,
      streamingSupported: true,
      description: "TanitBot API endpoint for web chat frontends",
    }),
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    }
  );
}

function extractApiKey(request: Request): string | null {
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey) return xApiKey.trim();

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  const url = new URL(request.url);
  const queryKey = url.searchParams.get("api_key");
  if (queryKey) return queryKey.trim();

  return null;
}

export async function POST(request: Request): Promise<Response> {
  // 1. API key authentication (enforced when CHAT_API_KEY environment variable is configured)
  const expectedKey = process.env.CHAT_API_KEY;
  if (expectedKey) {
    const providedKey = extractApiKey(request);
    if (!verifyApiKey(providedKey, expectedKey)) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized: Invalid or missing API key. Provide via 'X-API-Key' or 'Authorization: Bearer <key>'.",
        }),
        {
          status: 401,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // 2. Parse request payload
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON request body" }), {
      status: 400,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  }

  let messages: ChatMessage[] = [];
  if (typeof body?.message === "string" && body.message.trim().length > 0) {
    messages = [{ role: "user", content: body.message.trim() }];
  } else if (Array.isArray(body?.messages) && body.messages.length > 0) {
    messages = body.messages
      .filter((m: any) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .map((m: any) => ({
        role: m.role === "assistant" ? ("assistant" as const) : m.role === "system" ? ("system" as const) : ("user" as const),
        content: m.content.trim(),
      }));
  }

  if (messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Request must include a non-empty 'message' string or 'messages' array" }),
      {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const wantsStreaming = body?.stream !== false && request.headers.get("accept") !== "application/json";

  // 3. Non-streaming mode
  if (!wantsStreaming) {
    try {
      const response = await callModal(messages);
      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
        },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
        {
          status: 500,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // 4. Streaming mode (Server-Sent Events)
  const encoder = new TextEncoder();
  const abortController = new AbortController();

  if (request.signal) {
    request.signal.addEventListener("abort", () => {
      abortController.abort();
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      let emittedAnyToken = false;
      try {
        for await (const delta of streamModal(messages, abortController.signal)) {
          emittedAnyToken = true;
          const frame = `data: ${JSON.stringify({ delta })}\n\n`;
          controller.enqueue(encoder.encode(frame));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (err: any) {
        // Fall back to non-streaming if stream died before any tokens (e.g. Modal cold start 303 redirect)
        if (!emittedAnyToken && (err instanceof ModalStreamUnavailable || err?.name === "ModalStreamUnavailable")) {
          try {
            const fallbackText = await callModal(messages);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: fallbackText })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
            return;
          } catch (fallbackErr: any) {
            const errorMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
            controller.close();
            return;
          }
        }
        const errorMsg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
        controller.close();
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
