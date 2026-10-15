import { timingSafeEqual } from "node:crypto";

export function verifyApiKey(providedKey: string | null, expectedKey: string): boolean {
  if (!providedKey) return false;

  const a = Buffer.from(providedKey);
  const b = Buffer.from(expectedKey);

  return a.length === b.length && timingSafeEqual(a, b);
}
