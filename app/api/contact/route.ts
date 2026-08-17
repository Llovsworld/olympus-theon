import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtmlText } from '@/lib/sanitize-html';
import { normalizeEmail, readJsonObject, readString, RequestValidationError } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, 'contact', { limit: 5, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            return NextResponse.json(
                { error: 'Contact email service is not configured' },
                { status: 503 }
            );
        }

        const body = await readJsonObject(request);
        const name = readString(body, 'name', { required: true, maxLength: 120 })!;
        const email = normalizeEmail(body.email);
        const message = readString(body, 'message', { required: true, maxLength: 10_000 })!;
        const recipient = process.env.CONTACT_EMAIL_TO || 'Olympustheon@gmail.com';
        const from = process.env.RESEND_FROM_EMAIL || 'Olympus Theon <noreply@olympustheon.com>';
        const safeMessage = escapeHtmlText(message).replace(/\r?\n/g, '<br>');
        const subjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 80);

        const resend = new Resend(resendApiKey);
        const result = await resend.emails.send({
            from,
            to: recipient,
            replyTo: email,
            subject: `Nuevo contacto de ${subjectName}`,
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.6">
                    <h1>Nuevo mensaje de contacto</h1>
                    <p><strong>Nombre:</strong> ${escapeHtmlText(name)}</p>
                    <p><strong>Email:</strong> ${escapeHtmlText(email)}</p>
                    <hr>
                    <p>${safeMessage}</p>
                </div>
            `,
            text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
        });

        if (result.error) {
            console.error('Contact email provider error:', result.error.name);
            return NextResponse.json(
                { error: 'Failed to send message' },
                { status: 502 }
            );
        }

        return NextResponse.json(
            { message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing contact form:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
