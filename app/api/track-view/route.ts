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

        let updatedRows = 0;

        if (type === 'post') {
            // Prisma's normal update also refreshes the @updatedAt field. A
            // view is analytics, not an editorial change, so update only the
            // counter to keep SEO modification dates truthful.
            updatedRows = await prisma.$executeRaw`
                UPDATE "Post"
                SET "views" = "views" + 1
                WHERE "slug" = ${slug} AND "published" = true
            `;
        } else if (type === 'book') {
            updatedRows = await prisma.$executeRaw`
                UPDATE "Book"
                SET "views" = "views" + 1
                WHERE "slug" = ${slug} AND "published" = true
            `;
        } else {
            return NextResponse.json(
                { error: 'Invalid type' },
                { status: 400 }
            );
        }

        if (updatedRows === 0) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
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
