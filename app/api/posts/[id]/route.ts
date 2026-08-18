import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidateBlogContent } from '@/lib/revalidate-content';

function isMissingRecord(error: unknown) {
    return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'P2025');
}

// GET single post
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// UPDATE post
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                content: body.content,
                excerpt: body.excerpt || null,
                metaDescription: body.metaDescription || null,
                category: body.category || null,
                featuredImage: body.featuredImage || null,
                published: body.published,
            },
        });

        revalidateBlogContent();

        return NextResponse.json(updatedPost);
    } catch (error) {
        if (isMissingRecord(error)) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE post
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.post.delete({ where: { id } });
        revalidateBlogContent();

        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        if (isMissingRecord(error)) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
