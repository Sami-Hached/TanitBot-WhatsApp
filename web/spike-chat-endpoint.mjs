// Test script to verify the /api/chat endpoint
//
// Usage:
//   node spike-chat-endpoint.mjs [url] [prompt] [apiKey]
//
// Defaults:
//   url:    http://localhost:3000/api/chat
//   prompt: "شنوة نعمل كي نكون ضحية ابتزاز إلكتروني؟"
//   apiKey: process.env.CHAT_API_KEY ?? ""

const url = process.argv[2] || process.env.CHAT_ENDPOINT_URL || "http://localhost:3000/api/chat";
const prompt = process.argv[3] || "شنوة نعمل كي نكون ضحية ابتزاز إلكتروني؟";
const apiKey = process.argv[4] || process.env.CHAT_API_KEY || "";

console.log(`Connecting to: ${url}`);
console.log(`Prompt: "${prompt}"`);
if (apiKey) console.log(`Using API Key: ${apiKey.slice(0, 4)}...`);

const headers = {
  "Content-Type": "application/json",
  "Accept": "text/event-stream",
};
if (apiKey) {
  headers["X-API-Key"] = apiKey;
}

try {
  const start = Date.now();
  const at = () => `${((Date.now() - start) / 1000).toFixed(1)}s`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  console.log(`[${at()}] HTTP Status: ${res.status}`);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Request failed (${res.status}): ${errorBody}`);
    process.exit(1);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let sep;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);

      const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;

      const event = JSON.parse(dataLine.slice("data:".length).trim());
      if (event.delta) {
        process.stdout.write(event.delta);
      }
      if (event.done) {
        console.log(`\n\n[${at()}] Stream finished successfully.`);
      }
      if (event.error) {
        console.error(`\n[${at()}] Stream error event:`, event.error);
      }
    }
  }
} catch (err) {
  console.error("Fetch failed:", err);
  process.exit(1);
}
