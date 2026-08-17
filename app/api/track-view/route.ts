import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeSlug, readJsonObject, RequestValidationError } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    const limited = rateLimit(request, 'track-view', { limit: 60, windowMs: 60 * 1000 });
    if (limited) return limited;

    try {
        const body = await readJsonObject(request);
        const { type, slug } = body;

        if (type !== 'post' && type !== 'book') {
            throw new RequestValidationError('Invalid type');
        }
        const normalizedSlug = normalizeSlug(slug);

        if (type === 'post') {
            const result = await prisma.post.updateMany({
                where: { slug: normalizedSlug, published: true },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            if (result.count === 0) {
                return NextResponse.json({ error: 'Post not found' }, { status: 404 });
            }
        } else if (type === 'book') {
            const result = await prisma.book.updateMany({
                where: { slug: normalizedSlug, published: true },
                data: {
                    views: {
                        increment: 1
                    }
                }
            });
            if (result.count === 0) {
                return NextResponse.json({ error: 'Book not found' }, { status: 404 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking view:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Failed to track view' },
            { status: 500 }
        );
    }
}
