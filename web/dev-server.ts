try {
  process.loadEnvFile?.(".env");
} catch {}

import http from "node:http";
import { GET, POST, OPTIONS } from "./api/chat.js";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `localhost:${PORT}`}`);

  if (url.pathname === "/api/chat") {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

      const headers = new Headers();
      for (const [key, val] of Object.entries(req.headers)) {
        if (val) {
          if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
          else headers.set(key, val);
        }
      }

      const webReq = new Request(url.toString(), {
        method: req.method,
        headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? body : undefined,
      });

      let webRes: Response;
      if (req.method === "OPTIONS") {
        webRes = await OPTIONS();
      } else if (req.method === "GET") {
        webRes = await GET();
      } else if (req.method === "POST") {
        webRes = await POST(webReq);
      } else {
        webRes = new Response("Method not allowed", { status: 405 });
      }

      const responseHeaders: Record<string, string> = {};
      webRes.headers.forEach((v, k) => {
        responseHeaders[k] = v;
      });

      res.writeHead(webRes.status, responseHeaders);

      if (webRes.body) {
        const reader = webRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
      return;
    } catch (err: any) {
      console.error("Handler error:", err);
      if (!res.headersSent) res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err?.message || String(err) }));
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found", path: url.pathname }));
});

server.listen(PORT, () => {
  console.log(`\nTanitBot local API gateway running at http://localhost:${PORT}/api/chat`);
  console.log("Ready to proxy chat requests to Modal.\n");
});
