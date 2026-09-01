import 'server-only';

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

export function createConfirmationToken() {
    const token = randomBytes(32).toString('base64url');
    return { token, hash: hashConfirmationToken(token) };
}

export function hashConfirmationToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}

function getSigningSecret() {
    const secret = process.env.NEWSLETTER_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error('Newsletter token secret is not configured');
    }
    return secret;
}

export function createUnsubscribeToken(subscriberId: string) {
    return createHmac('sha256', getSigningSecret())
        .update(subscriberId)
        .digest('base64url');
}

export function verifyUnsubscribeToken(subscriberId: string, token: string) {
    const expected = createUnsubscribeToken(subscriberId);
    const expectedBuffer = Buffer.from(expected);
    const tokenBuffer = Buffer.from(token);

    return expectedBuffer.length === tokenBuffer.length
        && timingSafeEqual(expectedBuffer, tokenBuffer);
}
