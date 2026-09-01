import { NextResponse } from 'next/server';

import { hashConfirmationToken } from '@/lib/newsletter-token';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const rateLimit = checkRateLimit(request, {
        scope: 'subscribe-confirm',
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
        const token = typeof body.token === 'string' ? body.token.trim() : '';

        if (token.length < 20 || token.length > 200) {
            return NextResponse.json({ error: 'El enlace de confirmación no es válido.' }, { status: 400 });
        }

        const subscriber = await prisma.subscriber.findUnique({
            where: { confirmationTokenHash: hashConfirmationToken(token) },
            select: { id: true, confirmationExpiresAt: true },
        });

        if (!subscriber || !subscriber.confirmationExpiresAt || subscriber.confirmationExpiresAt < new Date()) {
            return NextResponse.json(
                { error: 'El enlace no es válido o ha caducado. Solicita una nueva suscripción.' },
                { status: 400 },
            );
        }

        await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
                active: true,
                confirmedAt: new Date(),
                confirmationTokenHash: null,
                confirmationExpiresAt: null,
                unsubscribedAt: null,
            },
        });

        return NextResponse.json({ message: 'Suscripción confirmada correctamente.' });
    } catch (error) {
        console.error('Subscription confirmation failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'No hemos podido confirmar la suscripción.' }, { status: 500 });
    }
}
