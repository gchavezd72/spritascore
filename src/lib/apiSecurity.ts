import type { NextRequest } from "next/server";

const MAX_BODY_BYTES = 32_768;
const WEBHOOK_TIMEOUT_MS = 10_000;

const ALLOWED_ORIGINS = new Set(
  [
    "https://spritascore.com",
    "https://www.spritascore.com",
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : null,
  ].filter((v): v is string => Boolean(v))
);

export function isBodyTooLarge(request: NextRequest): boolean {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return false;
  const size = Number.parseInt(contentLength, 10);
  return Number.isFinite(size) && size > MAX_BODY_BYTES;
}

export function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    return process.env.NODE_ENV === "development";
  }
  return ALLOWED_ORIGINS.has(origin);
}

export async function forwardToCrmWebhook(payload: unknown): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) return true;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    return response.ok;
  } catch {
    return false;
  }
}