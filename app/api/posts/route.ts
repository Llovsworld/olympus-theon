import { after, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateBlogContent } from '@/lib/revalidate-content';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    // If requesting all posts (drafts included), verify admin.
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
    return NextResponse.json(posts, includeAll ? {
        headers: { 'Cache-Control': 'private, no-store' },
    } : undefined);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let requestedSlug = 'provided';

    try {
        const body = await request.json();
        const { title, slug, content, excerpt, metaDescription, category, featuredImage, published = false } = body;
        requestedSlug = slug;

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                metaDescription: metaDescription || null,
                category: category || null,
                featuredImage,
                published: published === true,
            },
        });

        revalidateBlogContent();

        // Keep email work out of the response path while allowing the runtime
        // to finish it after the response has been sent.
        if (post.published) {
            after(async () => {
                try {
                    await sendNewsletter('post', {
                        title: post.title,
                        slug: post.slug,
                        content: post.content.substring(0, 200) + '...',
                    });
                } catch (error) {
                    console.error('Background newsletter error:', error);
                }
            });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);

        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${requestedSlug}" is already in use. Please choose a different URL slug.` },
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

        revalidateBlogContent();

        return NextResponse.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
