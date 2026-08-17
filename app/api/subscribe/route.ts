import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeEmail, readJsonObject, RequestValidationError } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, 'subscribe', { limit: 10, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    try {
        const body = await readJsonObject(request);
        const email = normalizeEmail(body.email);

        await prisma.subscriber.upsert({
            where: { email },
            update: { active: true },
            create: { email, active: true },
        });

        return NextResponse.json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.error('Subscription error:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
