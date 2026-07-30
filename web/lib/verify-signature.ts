import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyMetaSignature(
  rawBody: string,
  header: string | null,
  appSecret: string
): boolean {
  if (!header?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(header.slice(7), "hex");

  return a.length === b.length && timingSafeEqual(a, b);
}
