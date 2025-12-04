import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    // If requesting all posts (drafts included), verify admin
    if (includeAll) {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const posts = await prisma.post.findMany({
        where: includeAll ? {} : { published: true },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, content, featuredImage, published = false } = body;

        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug },
        });

        if (existingPost) {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${slug}" is already in use. Please choose a different URL slug.` },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                featuredImage,
                published: published === true,
            },
        });

        // Trigger Newsletter if published
        if (post.published) {
            // Run in background (don't await to avoid blocking response)
            sendNewsletter('post', {
                title: post.title,
                slug: post.slug,
                content: post.content.substring(0, 200) + '...', // Brief snippet
            }).catch((err: unknown) => console.error('Background email error:', err));
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);

        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${(error as any).meta?.target?.[0] || 'provided'}" is already in use. Please choose a different URL slug.` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create post', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
