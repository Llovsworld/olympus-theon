import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { escapeHtmlText } from '@/lib/sanitize-html';

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_BATCH_SIZE = 10;

function getPublicAppUrl(): URL {
    const candidate = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!candidate) {
        throw new Error('NEXT_PUBLIC_APP_URL must be configured before sending newsletters.');
    }

    let url: URL;
    try {
        url = new URL(candidate);
    } catch {
        throw new Error('NEXT_PUBLIC_APP_URL must be a valid HTTP(S) URL.');
    }

    if (
        !['http:', 'https:'].includes(url.protocol)
        || !url.hostname
        || url.username.length > 0
        || url.password.length > 0
    ) {
        throw new Error('NEXT_PUBLIC_APP_URL must be a valid HTTP(S) URL.');
    }

    url.search = '';
    url.hash = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url;
}

export async function sendNewsletter(type: 'post' | 'book', item: { title: string; slug: string; description?: string; content?: string }) {
    if (!resend) {
        console.warn('⚠️ RESEND_API_KEY is missing. Newsletter will not be sent.');
        return;
    }

    // Fail before querying subscribers or attempting any delivery. There is no
    // implicit localhost destination in production or development.
    const appUrl = getPublicAppUrl();

    try {
        // Fetch all active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: { active: true },
            select: { email: true },
        });

        if (subscribers.length === 0) {
            console.log('No active subscribers to notify.');
            return;
        }

        const subject = type === 'post' ? `New Post: ${item.title}` : `New Book: ${item.title}`;
        const url = new URL(
            `${type === 'post' ? 'blog' : 'books'}/${encodeURIComponent(item.slug)}`,
            appUrl
        ).toString();
        const safeUrl = escapeHtmlText(url);
        const safeTitle = escapeHtmlText(item.title);
        const safeDescription = item.description ? escapeHtmlText(item.description) : '';

        // Simple HTML Template
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">${safeTitle}</h1>
                ${safeDescription ? `<p style="font-size: 16px; color: #555;">${safeDescription}</p>` : ''}
                <div style="margin: 30px 0;">
                    <a href="${safeUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Read on Olympus Theon
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">
                    You received this email because you are subscribed to Olympus Theon updates.
                </p>
            </div>
        `;

        let failedCount = 0;

        // Process batches sequentially so a large audience cannot create an
        // unbounded number of simultaneous outbound requests.
        for (let index = 0; index < subscribers.length; index += EMAIL_BATCH_SIZE) {
            const batch = subscribers.slice(index, index + EMAIL_BATCH_SIZE);
            const results = await Promise.allSettled(batch.map((subscriber) =>
                resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'Olympus Theon <noreply@olympustheon.com>',
                    to: subscriber.email,
                    subject,
                    html,
                })
            ));

            failedCount += results.filter((result) =>
                result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error)
            ).length;
        }

        if (failedCount > 0) {
            console.error(`Newsletter failed for ${failedCount} of ${subscribers.length} subscribers.`);
        } else {
            console.log(`Newsletter sent to ${subscribers.length} subscribers.`);
        }

    } catch (error) {
        console.error('Failed to send newsletter:', error);
    }
}
