import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (!existing.active) {
                // Reactivate if previously unsubscribed
                await prisma.subscriber.update({
                    where: { email },
                    data: { active: true },
                });
                return NextResponse.json({ message: 'Welcome back! Subscription reactivated.' });
            }
            return NextResponse.json(
                { message: 'You are already subscribed.' },
                { status: 200 }
            );
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: { email },
        });

        return NextResponse.json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
