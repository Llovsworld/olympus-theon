import { after, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendNewsletter } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { revalidateBookContent } from '@/lib/revalidate-content';
import { getSafeExternalHref, getTrustedPublicMediaUrl, sanitizeRichText } from '@/lib/sanitize-content';
import { CONTENT_CATEGORIES, getCanonicalContentCategory } from '@/lib/content-categories';

function isMissingRecord(error: unknown) {
    return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'P2025');
}

// GET single book
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

        const book = await prisma.book.findUnique({
            where: { id },
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
    }
}

// UPDATE book
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
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
        const author = typeof body.author === 'string' ? body.author.trim() : '';
        const categoryInput = typeof body.category === 'string' ? body.category.trim() : '';
        const category = categoryInput ? getCanonicalContentCategory(categoryInput) : null;
        const description = typeof body.description === 'string' ? body.description.trim() : '';
        const content = typeof body.content === 'string' ? sanitizeRichText(body.content.trim()) : '';
        const coverImage = getTrustedPublicMediaUrl(typeof body.coverImage === 'string' ? body.coverImage : null);
        const link = getSafeExternalHref(typeof body.link === 'string' ? body.link : null);
        const published = body.published === true;

        const existingBook = await prisma.book.findUnique({
            where: { id },
            select: { published: true },
        });

        if (!existingBook) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        if (!title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            return NextResponse.json({ error: 'Revisa el título y la URL.' }, { status: 400 });
        }

        if ((body.category !== undefined && body.category !== null && typeof body.category !== 'string') || (categoryInput && !category)) {
            return NextResponse.json(
                {
                    error: 'Selecciona una categoría válida.',
                    allowedCategories: CONTENT_CATEGORIES.map(({ label }) => label),
                },
                { status: 400 },
            );
        }

        if (published && (!description || !category)) {
            return NextResponse.json(
                { error: 'Añade una descripción y selecciona una categoría antes de publicar el libro.' },
                { status: 400 },
            );
        }

        const updatedBook = await prisma.book.update({
            where: { id },
            data: {
                title,
                slug,
                author: author || null,
                category,
                description,
                content: content || null,
                coverImage,
                link,
                published,
            },
        });

        revalidateBookContent();

        if (!existingBook.published && updatedBook.published) {
            after(async () => {
                try {
                    await sendNewsletter('book', {
                        title: updatedBook.title,
                        slug: updatedBook.slug,
                        description: updatedBook.description,
                    });
                } catch (error) {
                    console.error('Background newsletter error:', error);
                }
            });
        }

        return NextResponse.json(updatedBook);
    } catch (error) {
        if (isMissingRecord(error)) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        console.error('Error updating book:', error);
        return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
    }
}

// DELETE book
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

        await prisma.book.delete({ where: { id } });
        revalidateBookContent();

        return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
    } catch (error) {
        if (isMissingRecord(error)) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        console.error('Error deleting book:', error);
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}
