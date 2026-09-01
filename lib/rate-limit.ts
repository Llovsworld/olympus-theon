import 'server-only';

import { createHash } from 'node:crypto';

type RateBucket = { count: number; resetAt: number };

const globalBuckets = globalThis as typeof globalThis & {
    olympusRateLimitBuckets?: Map<string, RateBucket>;
};

const buckets = globalBuckets.olympusRateLimitBuckets ?? new Map<string, RateBucket>();
globalBuckets.olympusRateLimitBuckets = buckets;

function requestFingerprint(request: Request, scope: string) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const ip = forwarded || request.headers.get('x-real-ip') || 'unknown';
    return createHash('sha256').update(`${scope}:${ip}`).digest('hex');
}

/**
 * Lightweight abuse protection for public forms. This limits each warm server
 * instance without persisting raw IP addresses. Platform-level rate limiting
 * remains advisable for stronger protection across all regions.
 */
export function checkRateLimit(
    request: Request,
    { scope, limit, windowMs }: { scope: string; limit: number; windowMs: number },
) {
    const now = Date.now();
    const key = requestFingerprint(request, scope);
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= limit) {
        return {
            allowed: false,
            retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
        };
    }

    current.count += 1;

    if (buckets.size > 5000) {
        for (const [bucketKey, bucket] of buckets) {
            if (bucket.resetAt <= now) buckets.delete(bucketKey);
        }
    }

    return { allowed: true, retryAfterSeconds: 0 };
}
