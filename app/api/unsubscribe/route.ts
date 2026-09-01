import { NextResponse } from 'next/server';

import { verifyUnsubscribeToken } from '@/lib/newsletter-token';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const rateLimit = checkRateLimit(request, {
        scope: 'unsubscribe',
        limit: 10,
        windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Demasiados intentos. Espera unos minutos.' },
            { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
        );
    }

    try {
        const body = await request.json();
        const subscriberId = typeof body.subscriberId === 'string' ? body.subscriberId.trim() : '';
        const token = typeof body.token === 'string' ? body.token.trim() : '';

        if (!subscriberId || !token || !verifyUnsubscribeToken(subscriberId, token)) {
            return NextResponse.json({ error: 'El enlace de baja no es válido.' }, { status: 400 });
        }

        await prisma.subscriber.updateMany({
            where: { id: subscriberId },
            data: {
                active: false,
                unsubscribedAt: new Date(),
                confirmationTokenHash: null,
                confirmationExpiresAt: null,
            },
        });

        return NextResponse.json({ message: 'La baja se ha procesado correctamente.' });
    } catch (error) {
        console.error('Unsubscribe failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'No hemos podido procesar la baja.' }, { status: 500 });
    }
}
