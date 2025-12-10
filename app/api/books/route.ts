import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    return NextResponse.json(books);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, author, description, content, coverImage, link, published = false } = body;

        // Check for duplicate slug
        const existingBook = await prisma.book.findUnique({
            where: { slug },
        });

        if (existingBook) {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${slug}" is already in use.` },
                { status: 400 }
            );
        }

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

        // Trigger Newsletter if published
        if (book.published) {
            // Run in background
            sendNewsletter('book', {
                title: book.title,
                slug: book.slug,
                description: book.description,
            }).catch((err: unknown) => console.error('Background email error:', err));
        }

        return NextResponse.json(book);
    } catch (error) {
        console.error('Error creating book:', error);
        return NextResponse.json(
            { error: 'Failed to create book', details: error instanceof Error ? error.message : String(error) },
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
                { error: 'Book ID is required' },
                { status: 400 }
            );
        }

        await prisma.book.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: 'Failed to delete book', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
