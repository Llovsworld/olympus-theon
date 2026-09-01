import { after, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateBookContent } from '@/lib/revalidate-content';
import { getSafeExternalHref, getTrustedPublicMediaUrl, sanitizeRichText } from '@/lib/sanitize-content';
import { CONTENT_CATEGORIES, getCanonicalContentCategory } from '@/lib/content-categories';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';

    if (includeAll) {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const books = await prisma.book.findMany({
        where: includeAll ? {} : { published: true },
        orderBy: { createdAt: 'desc' },
    });
    const responseBooks = includeAll
        ? books
        : books.map((book) => ({
            ...book,
            category: getCanonicalContentCategory(book.category),
        }));

    return NextResponse.json(responseBooks, includeAll ? {
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
        const { title, slug, author, category, description, content, coverImage, link, published = false } = body;
        const normalizedTitle = typeof title === 'string' ? title.trim() : '';
        const normalizedSlug = typeof slug === 'string' ? slug.trim() : '';
        const normalizedAuthor = typeof author === 'string' ? author.trim() : '';
        const categoryInput = typeof category === 'string' ? category.trim() : '';
        const normalizedCategory = categoryInput ? getCanonicalContentCategory(categoryInput) : null;
        const normalizedDescription = typeof description === 'string' ? description.trim() : '';
        const normalizedContent = typeof content === 'string' ? sanitizeRichText(content.trim()) : '';
        const normalizedCoverImage = getTrustedPublicMediaUrl(typeof coverImage === 'string' ? coverImage : null);
        const normalizedLink = getSafeExternalHref(typeof link === 'string' ? link : null);
        const shouldPublish = published === true;
        requestedSlug = normalizedSlug;

        if (!normalizedTitle || !normalizedSlug) {
            return NextResponse.json(
                { error: 'Título y URL son obligatorios.' },
                { status: 400 },
            );
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
            return NextResponse.json(
                { error: 'La URL solo puede contener letras minúsculas, números y guiones.' },
                { status: 400 },
            );
        }

        if ((category !== undefined && category !== null && typeof category !== 'string') || (categoryInput && !normalizedCategory)) {
            return NextResponse.json(
                {
                    error: 'Selecciona una categoría válida.',
                    allowedCategories: CONTENT_CATEGORIES.map(({ label }) => label),
                },
                { status: 400 },
            );
        }

        if (shouldPublish && (!normalizedDescription || !normalizedCategory)) {
            return NextResponse.json(
                { error: 'Añade una descripción y selecciona una categoría antes de publicar el libro.' },
                { status: 400 },
            );
        }

        const book = await prisma.book.create({
            data: {
                title: normalizedTitle,
                slug: normalizedSlug,
                author: normalizedAuthor || null,
                category: normalizedCategory,
                description: normalizedDescription,
                content: normalizedContent || null,
                coverImage: normalizedCoverImage,
                link: normalizedLink,
                published: shouldPublish,
            },
        });

        revalidateBookContent();

        if (book.published) {
            after(async () => {
                try {
                    await sendNewsletter('book', {
                        title: book.title,
                        slug: book.slug,
                        description: book.description,
                    });
                } catch (error) {
                    console.error('Background newsletter error:', error);
                }
            });
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error creating book:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${requestedSlug}" is already in use.` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create book', details: error instanceof Error ? error.message : String(error) },
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
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        await prisma.book.delete({
            where: { id },
        });

        revalidateBookContent();

        return NextResponse.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: 'Failed to delete book', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
