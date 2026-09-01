import { NextResponse } from 'next/server';

import { sendSubscriptionConfirmation } from '@/lib/email';
import { LEGAL_POLICY_VERSION } from '@/lib/legal-public';
import { createConfirmationToken, normalizeEmail } from '@/lib/newsletter-token';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_SUBSCRIPTION_MESSAGE =
    'Si la dirección puede suscribirse, recibirá un correo para confirmar la suscripción.';

export async function POST(request: Request) {
    const rateLimit = checkRateLimit(request, {
        scope: 'subscribe',
        limit: 5,
        windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Has realizado demasiados intentos. Espera antes de solicitar otro enlace.' },
            { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
        );
    }

    try {
        const body = await request.json();
        const email = normalizeEmail(typeof body.email === 'string' ? body.email : '');
        const consentAccepted = body.consentAccepted === true;
        const privacyAccepted = body.privacyAccepted === true;
        const source = body.source === 'footer' || body.source === 'homepage'
            ? body.source
            : 'website';
        const website = typeof body.website === 'string' ? body.website.trim() : '';

        if (website) {
            return NextResponse.json({ message: 'Revisa tu correo para confirmar la suscripción.' });
        }

        if (!EMAIL_PATTERN.test(email) || email.length > 254) {
            return NextResponse.json({ error: 'Introduce un correo electrónico válido.' }, { status: 400 });
        }

        if (!consentAccepted || !privacyAccepted) {
            return NextResponse.json(
                { error: 'Debes aceptar la suscripción y confirmar que has leído la política de privacidad.' },
                { status: 400 },
            );
        }

        const { token, hash } = createConfirmationToken();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const existingSubscriber = await prisma.subscriber.findUnique({
            where: { email },
            select: { active: true, confirmedAt: true },
        });

        if (existingSubscriber?.active && existingSubscriber.confirmedAt) {
            return NextResponse.json({ message: GENERIC_SUBSCRIPTION_MESSAGE });
        }

        await prisma.subscriber.deleteMany({
            where: {
                active: false,
                confirmedAt: null,
                confirmationExpiresAt: { lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
            },
        });

        await prisma.subscriber.upsert({
            where: { email },
            create: {
                email,
                active: false,
                consentAt: now,
                consentVersion: LEGAL_POLICY_VERSION,
                consentSource: source,
                confirmationTokenHash: hash,
                confirmationExpiresAt: expiresAt,
                confirmedAt: null,
                unsubscribedAt: null,
            },
            update: {
                active: false,
                consentAt: now,
                consentVersion: LEGAL_POLICY_VERSION,
                consentSource: source,
                confirmationTokenHash: hash,
                confirmationExpiresAt: expiresAt,
                confirmedAt: null,
            },
        });

        await sendSubscriptionConfirmation(email, token);

        return NextResponse.json({ message: GENERIC_SUBSCRIPTION_MESSAGE });
    } catch (error) {
        console.error('Subscription request failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { error: 'No hemos podido iniciar la suscripción. Inténtalo de nuevo más tarde.' },
            { status: 503 },
        );
    }
}
