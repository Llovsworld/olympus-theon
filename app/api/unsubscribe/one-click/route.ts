import { NextResponse } from 'next/server';

import { verifyUnsubscribeToken } from '@/lib/newsletter-token';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    const url = new URL(request.url);
    const subscriberId = url.searchParams.get('subscriber')?.trim() || '';
    const token = url.searchParams.get('token')?.trim() || '';

    if (!subscriberId || !token || !verifyUnsubscribeToken(subscriberId, token)) {
        return NextResponse.json(
            { error: 'Invalid unsubscribe request.' },
            { status: 400, headers: { 'Cache-Control': 'no-store' } },
        );
    }

    try {
        await prisma.subscriber.updateMany({
            where: { id: subscriberId },
            data: {
                active: false,
                unsubscribedAt: new Date(),
                confirmationTokenHash: null,
                confirmationExpiresAt: null,
            },
        });

        return NextResponse.json(
            { success: true },
            { headers: { 'Cache-Control': 'no-store' } },
        );
    } catch (error) {
        console.error('One-click unsubscribe failed:', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json(
            { error: 'Unsubscribe temporarily unavailable.' },
            { status: 500, headers: { 'Cache-Control': 'no-store' } },
        );
    }
}
