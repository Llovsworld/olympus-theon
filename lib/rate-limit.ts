import { NextResponse } from 'next/server';

type Bucket = { count: number; resetAt: number };
type BucketStore = Map<string, Bucket>;

const CLEANUP_INTERVAL_MS = 60 * 1000;
const MAX_BUCKETS = 10_000;

const globalRateLimit = globalThis as typeof globalThis & {
    olympusRateLimitBuckets?: BucketStore;
    olympusRateLimitLastCleanupAt?: number;
};

// This is deliberately a bounded, per-process safeguard. It is not a
// distributed quota and must not be presented as one across server instances.
const buckets = globalRateLimit.olympusRateLimitBuckets ?? new Map<string, Bucket>();
globalRateLimit.olympusRateLimitBuckets = buckets;
globalRateLimit.olympusRateLimitLastCleanupAt ??= 0;

function deleteExpiredBuckets(now: number): void {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

function maintainBucketStore(now: number, needsCapacity: boolean): void {
    const lastCleanupAt = globalRateLimit.olympusRateLimitLastCleanupAt ?? 0;

    if (needsCapacity || now - lastCleanupAt >= CLEANUP_INTERVAL_MS) {
        deleteExpiredBuckets(now);
        globalRateLimit.olympusRateLimitLastCleanupAt = now;
    }

    // Enforce a hard memory bound even if every bucket is still active. Map
    // iteration order makes this evict the oldest inserted buckets first.
    while (needsCapacity && buckets.size >= MAX_BUCKETS) {
        const oldest = buckets.keys().next();
        if (oldest.done) break;
        buckets.delete(oldest.value);
    }
}

function clientAddress(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    return request.headers.get('cf-connecting-ip')
        || request.headers.get('x-real-ip')
        || forwarded
        || 'unknown';
}

export function rateLimit(
    request: Request,
    scope: string,
    options: { limit: number; windowMs: number }
): NextResponse | null {
    const now = Date.now();
    const key = `${scope}:${clientAddress(request)}`;
    maintainBucketStore(now, !buckets.has(key) && buckets.size >= MAX_BUCKETS);
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + options.windowMs });
        return null;
    }

    existing.count += 1;
    if (existing.count <= options.limit) return null;

    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
}
