import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidateBookContent } from '@/lib/revalidate-content';

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

        const updatedBook = await prisma.book.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                author: body.author || null,
                description: body.description,
                content: body.content || null,
                coverImage: body.coverImage || null,
                link: body.link || null,
                published: body.published,
            },
        });

        revalidateBookContent();

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
