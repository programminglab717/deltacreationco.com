import "server-only";

/**
 * Request guards for public form endpoints: payload limits, same-origin
 * checks, per-IP rate limiting and lightweight spam heuristics.
 */

const MAX_BODY_BYTES = 32 * 1024;
const buckets = new Map<string, number[]>();

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true as const };
}

/** Rejects cross-site requests when the browser sends an Origin header. */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJson(
  req: Request,
): Promise<{ ok: true; data: unknown } | { ok: false; status: number; error: string }> {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, status: 415, error: "Expected JSON." };
  }
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return { ok: false, status: 413, error: "Request too large." };
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return { ok: false, status: 413, error: "Request too large." };
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, error: "Invalid JSON." };
  }
}

/**
 * Returns a reason when a submission looks automated. Callers respond with a
 * normal success message so bots learn nothing, but nothing is sent.
 */
export function spamReason({ website, startedAt, text }: { website?: string; startedAt?: number; text: string }) {
  if (website && website.trim() !== "") return "honeypot";
  if (startedAt) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < 2500) return "too-fast";
  }
  const links = text.match(/https?:\/\//gi)?.length ?? 0;
  if (links > 4) return "too-many-links";
  return null;
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
