import { after, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendNewsletter } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { revalidateBlogContent } from '@/lib/revalidate-content';
import { sanitizeRichText } from '@/lib/sanitize-content';
import { getContentImageUrl } from '@/lib/seo';
import {
    getCanonicalPostCategories,
    isValidPostCategorySelection,
    POST_CATEGORIES,
} from '@/lib/post-categories';

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

        const existingPost = await prisma.post.findUnique({
            where: { id },
            select: { slug: true, published: true },
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
        const content = typeof body.content === 'string' ? sanitizeRichText(body.content.trim()) : '';
        const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
        const metaDescription = typeof body.metaDescription === 'string' ? body.metaDescription.trim() : '';
        const categorySelection = body.categories !== undefined
            ? body.categories
            : typeof body.category === 'string' && body.category.trim()
                ? [body.category]
                : [];
        const categories = getCanonicalPostCategories(categorySelection);
        const category = categories[0] ?? null;
        const featuredImage = typeof body.featuredImage === 'string' ? body.featuredImage.trim() : '';
        const published = body.published === true;

        if (!title || !slug || (published && !content)) {
            return NextResponse.json(
                { error: 'Título, URL y contenido son obligatorios para publicar.' },
                { status: 400 },
            );
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return NextResponse.json(
                { error: 'La URL solo puede contener letras minúsculas, números y guiones.' },
                { status: 400 },
            );
        }

        const hasInvalidCategories = body.categories !== undefined
            ? !isValidPostCategorySelection(body.categories)
            : body.category !== undefined
                && body.category !== null
                && (
                    typeof body.category !== 'string'
                    || (Boolean(body.category.trim()) && !category)
                );

        if (hasInvalidCategories) {
            return NextResponse.json(
                {
                    error: 'Selecciona únicamente categorías válidas.',
                    allowedCategories: POST_CATEGORIES.map(({ label }) => label),
                },
                { status: 400 },
            );
        }

        if (published && (!excerpt || !metaDescription || categories.length === 0 || !getContentImageUrl(featuredImage))) {
            return NextResponse.json(
                { error: 'Para publicar, completa el extracto, la descripción SEO, al menos una categoría y una imagen válida.' },
                { status: 400 },
            );
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt: excerpt || null,
                metaDescription: metaDescription || null,
                category,
                categories,
                featuredImage: featuredImage || null,
                published,
            },
        });

        revalidateBlogContent(updatedPost.slug, existingPost.slug);

        if (!existingPost.published && updatedPost.published) {
            after(async () => {
                try {
                    await sendNewsletter('post', {
                        title: updatedPost.title,
                        slug: updatedPost.slug,
                        description: updatedPost.excerpt || undefined,
                    });
                } catch (error) {
                    console.error('Background newsletter error:', error);
                }
            });
        }

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

        const deletedPost = await prisma.post.delete({ where: { id } });
        revalidateBlogContent(deletedPost.slug);

        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        if (isMissingRecord(error)) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
