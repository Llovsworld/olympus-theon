import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parsePostInput } from '@/lib/content-input';
import { readJsonObject, RequestValidationError } from '@/lib/validation';
import { sendNewsletter } from '@/lib/email';
import { after } from 'next/server';

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
        const body = await readJsonObject(request);

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const input = parsePostInput(body, post.published);
        const updatedPost = await prisma.post.update({
            where: { id },
            data: input,
        });

        if (!post.published && updatedPost.published) {
            after(async () => {
                try {
                    await sendNewsletter('post', {
                        title: updatedPost.title,
                        slug: updatedPost.slug,
                        content: updatedPost.content.substring(0, 200) + '...',
                    });
                } catch (error) {
                    console.error('Background email error:', error);
                }
            });
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 });
        }
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

        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        await prisma.post.delete({ where: { id } });

        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
