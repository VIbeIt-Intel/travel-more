type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

// Memory is per server instance, so this slows abuse rather than guaranteeing a hard cap.
export function hit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

export function clear(key: string) {
  buckets.delete(key);
}
