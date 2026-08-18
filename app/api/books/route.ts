import { after, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidateBookContent } from '@/lib/revalidate-content';

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
    return NextResponse.json(books, includeAll ? {
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
        const { title, slug, author, description, content, coverImage, link, published = false } = body;
        requestedSlug = slug;

        const book = await prisma.book.create({
            data: {
                title,
                slug,
                author: author || null,
                description,
                content,
                coverImage,
                link,
                published: published === true,
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
