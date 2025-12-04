import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, slug } = body;

        if (!type || !slug) {
            return NextResponse.json(
                { error: 'Missing type or slug' },
                { status: 400 }
            );
        }

        if (type === 'post') {
            await prisma.post.update({
                where: { slug },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
        } else if (type === 'book') {
            await prisma.book.update({
                where: { slug },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid type' },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking view:', error);
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        );
    }
}
