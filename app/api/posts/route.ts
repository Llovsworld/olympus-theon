import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parsePostInput } from '@/lib/content-input';
import { parsePagination, readJsonObject, RequestValidationError } from '@/lib/validation';
import { after } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeAll = searchParams.get('all') === 'true';

        // If requesting all posts (drafts included), verify admin
        if (includeAll) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const pagination = parsePagination(searchParams);

        const posts = await prisma.post.findMany({
            where: includeAll ? {} : { published: true },
            orderBy: { createdAt: 'desc' },
            ...pagination,
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const input = parsePostInput(await readJsonObject(request));

        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug: input.slug },
        });

        if (existingPost) {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${input.slug}" is already in use. Please choose a different URL slug.` },
                { status: 409 }
            );
        }

        const post = await prisma.post.create({
            data: input,
        });

        // Trigger Newsletter if published
        if (post.published) {
            after(async () => {
                try {
                    await sendNewsletter('post', {
                        title: post.title,
                        slug: post.slug,
                        content: post.content.substring(0, 200) + '...',
                    });
                } catch (error) {
                    console.error('Background email error:', error);
                }
            });
        }

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);

        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Duplicate slug', details: 'The provided slug is already in use. Please choose a different URL slug.' },
                { status: 409 }
            );
        }

        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
