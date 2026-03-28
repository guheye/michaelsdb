/**
 * In-process cooldown for POST /api/aggregate (single-instance).
 * Set AGGREGATE_COOLDOWN_MS in env to tune (default 60s).
 */
let lastAggregateAt = 0;

export function acquireAggregateSlot(): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const minMs = Number(process.env.AGGREGATE_COOLDOWN_MS) || 60_000;
  const now = Date.now();
  const elapsed = now - lastAggregateAt;
  if (lastAggregateAt > 0 && elapsed < minMs) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((minMs - elapsed) / 1000),
    };
  }
  lastAggregateAt = now;
  return { allowed: true, retryAfterSeconds: 0 };
}
