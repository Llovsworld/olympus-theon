import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletter(type: 'post' | 'book', item: { title: string; slug: string; description?: string; content?: string }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY is missing. Newsletter will not be sent.');
        return;
    }

    try {
        // Fetch all active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: { active: true },
        });

        if (subscribers.length === 0) {
            console.log('No active subscribers to notify.');
            return;
        }

        const subject = type === 'post' ? `New Post: ${item.title}` : `New Book: ${item.title}`;
        const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${type === 'post' ? 'blog' : 'books'}/${item.slug}`;

        // Simple HTML Template
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333;">${item.title}</h1>
                ${item.description ? `<p style="font-size: 16px; color: #555;">${item.description}</p>` : ''}
                <div style="margin: 30px 0;">
                    <a href="${url}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        Read on Olympus Theon
                    </a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">
                    You received this email because you are subscribed to Olympus Theon updates.
                </p>
            </div>
        `;

        // Send emails in batches (Resend handles this well, but loop for individual tracking if needed)
        // For simplicity, we'll send to the first batch or loop. Resend allows 'bcc' for bulk or individual calls.
        // Best practice for bulk: Loop and send individual emails or use Resend's batch API.
        // For this MVP, we will loop.

        const emailPromises = subscribers.map((sub: { email: string }) =>
            resend.emails.send({
                from: 'Olympus Theon <noreply@olympustheon.com>', // User needs to configure domain
                to: sub.email,
                subject: subject,
                html: html,
            })
        );

        await Promise.allSettled(emailPromises);
        console.log(`✅ Newsletter sent to ${subscribers.length} subscribers.`);

    } catch (error) {
        console.error('Failed to send newsletter:', error);
    }
}
