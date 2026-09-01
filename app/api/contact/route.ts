import { NextResponse } from 'next/server';

import { sendContactMessage } from '@/lib/email';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    const rateLimit = checkRateLimit(request, {
        scope: 'contact',
        limit: 5,
        windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            { error: 'Has realizado demasiados intentos. Espera unos minutos antes de volver a probar.' },
            { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
        );
    }

    try {
        const body = await request.json();
        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const privacyAccepted = body.privacyAccepted === true;
        const website = typeof body.website === 'string' ? body.website.trim() : '';

        // Honeypot submissions receive a generic success response without processing data.
        if (website) {
            return NextResponse.json({ message: 'Mensaje recibido.' });
        }

        if (!privacyAccepted) {
            return NextResponse.json(
                { error: 'Debes confirmar que has leído la política de privacidad.' },
                { status: 400 },
            );
        }

        if (name.length < 2 || name.length > 100 || !EMAIL_PATTERN.test(email) || email.length > 254) {
            return NextResponse.json({ error: 'Revisa el nombre y el correo electrónico.' }, { status: 400 });
        }

        if (message.length < 10 || message.length > 3000) {
            return NextResponse.json(
                { error: 'El mensaje debe tener entre 10 y 3.000 caracteres.' },
                { status: 400 },
            );
        }

        await sendContactMessage({ name, email, message });
        return NextResponse.json({ message: 'Mensaje enviado correctamente.' });
    } catch (error) {
        console.error('Contact delivery failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { error: 'No hemos podido enviar el mensaje. Escríbenos directamente por correo.' },
            { status: 503 },
        );
    }
}
