import 'server-only';

import { Resend } from 'resend';

import { featureFlags } from '@/lib/features';
import { prisma } from '@/lib/prisma';
import { createUnsubscribeToken } from '@/lib/newsletter-token';
import { legalPublic } from '@/lib/legal-public';
import { SITE_URL } from '@/lib/seo';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromAddress = process.env.EMAIL_FROM || 'Olympus Theon <hola@olympustheon.com>';
const contactRecipient = process.env.CONTACT_EMAIL || legalPublic.email;
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || SITE_URL).replace(/\/$/, '');

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function safeHeaderValue(value: string) {
    return value.replace(/[\r\n]+/g, ' ').trim();
}

async function sendEmail(payload: Parameters<NonNullable<typeof resend>['emails']['send']>[0]) {
    if (!resend) {
        throw new Error('Email service is not configured');
    }

    const result = await resend.emails.send(payload);
    if (result.error) {
        throw new Error(`Email provider rejected the request: ${result.error.name}`);
    }
}

export async function sendContactMessage({
    name,
    email,
    message,
}: {
    name: string;
    email: string;
    message: string;
}) {
    const safeName = safeHeaderValue(name);

    await sendEmail({
        from: fromAddress,
        to: contactRecipient,
        replyTo: email,
        subject: `Nueva consulta de ${safeName}`,
        text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;padding:24px;color:#181818">
                <h1 style="font-size:22px">Nueva consulta desde Olympus Theon</h1>
                <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
                <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
                <p><strong>Mensaje:</strong></p>
                <div style="white-space:pre-wrap;border-left:3px solid #111;padding-left:16px">${escapeHtml(message)}</div>
            </div>
        `,
    });
}

export async function sendSubscriptionConfirmation(email: string, token: string) {
    const confirmationUrl = `${appUrl}/confirmar-suscripcion#token=${encodeURIComponent(token)}`;

    await sendEmail({
        from: fromAddress,
        to: email,
        replyTo: contactRecipient,
        subject: 'Confirma tu suscripción a Olympus Theon',
        text: `Confirma tu suscripción abriendo este enlace: ${confirmationUrl}\n\nEl enlace caduca en 24 horas. Si no lo solicitaste, ignora este mensaje.`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;color:#181818">
                <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">Olympus Theon</p>
                <h1 style="font-size:26px">Confirma tu suscripción</h1>
                <p>Solo falta verificar que esta dirección de correo es tuya.</p>
                <p style="margin:28px 0">
                    <a href="${confirmationUrl}" style="display:inline-block;background:#111;color:#fff;padding:14px 22px;text-decoration:none;font-weight:700">
                        Confirmar suscripción
                    </a>
                </p>
                <p style="font-size:13px;color:#666">El enlace caduca en 24 horas. Si no solicitaste la suscripción, no necesitas hacer nada.</p>
            </div>
        `,
    });
}

export async function sendNewsletter(
    type: 'post' | 'book',
    item: { title: string; slug: string; description?: string; content?: string },
) {
    if (!featureFlags.newsletter || !resend) {
        console.warn('Newsletter skipped because the email service is not configured.');
        return;
    }

    const subscribers = await prisma.subscriber.findMany({
        where: {
            active: true,
            confirmedAt: { not: null },
        },
        select: { id: true, email: true },
    });

    if (subscribers.length === 0) return;

    const subjectTitle = safeHeaderValue(item.title);
    const subject = type === 'post' ? `Nuevo artículo: ${subjectTitle}` : `Nuevo libro: ${subjectTitle}`;
    const contentUrl = `${appUrl}/${type === 'post' ? 'blog' : 'books'}/${item.slug}`;
    const safeTitle = escapeHtml(item.title);
    const safeDescription = item.description ? escapeHtml(item.description) : '';

    const results = await Promise.allSettled(subscribers.map(async ({ id, email }) => {
        const unsubscribeToken = createUnsubscribeToken(id);
        const unsubscribeUrl = `${appUrl}/baja-newsletter#subscriber=${encodeURIComponent(id)}&token=${encodeURIComponent(unsubscribeToken)}`;
        const oneClickUrl = `${appUrl}/api/unsubscribe/one-click?subscriber=${encodeURIComponent(id)}&token=${encodeURIComponent(unsubscribeToken)}`;

        await sendEmail({
            from: fromAddress,
            to: email,
            replyTo: contactRecipient,
            subject,
            headers: {
                'List-Unsubscribe': `<${oneClickUrl}>`,
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
            text: `${item.title}\n${item.description || ''}\n\nLeer: ${contentUrl}\n\nDarte de baja: ${unsubscribeUrl}`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#181818">
                    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">Olympus Theon</p>
                    <h1 style="font-size:26px">${safeTitle}</h1>
                    ${safeDescription ? `<p style="font-size:16px;color:#555">${safeDescription}</p>` : ''}
                    <p style="margin:28px 0">
                        <a href="${contentUrl}" style="display:inline-block;background:#111;color:#fff;padding:14px 22px;text-decoration:none;font-weight:700">Leer en Olympus Theon</a>
                    </p>
                    <hr style="border:0;border-top:1px solid #ddd;margin:32px 0" />
                    <p style="font-size:12px;color:#666">
                        Recibes este correo porque confirmaste tu suscripción. Puedes
                        <a href="${unsubscribeUrl}"> darte de baja aquí</a> en cualquier momento.
                    </p>
                </div>
            `,
        });
    }));

    const failed = results.filter((result) => result.status === 'rejected').length;
    if (failed > 0) {
        console.error(`Newsletter delivery failed for ${failed} recipient(s).`);
    }
}
