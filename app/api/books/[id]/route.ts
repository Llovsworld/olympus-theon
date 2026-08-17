import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseBookInput } from '@/lib/content-input';
import { readJsonObject, RequestValidationError } from '@/lib/validation';
import { sendNewsletter } from '@/lib/email';
import { after } from 'next/server';

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
        const body = await readJsonObject(request);

        const book = await prisma.book.findUnique({ where: { id } });
        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const input = parseBookInput(body, book.published);
        const updatedBook = await prisma.book.update({
            where: { id },
            data: input,
        });

        if (!book.published && updatedBook.published) {
            after(async () => {
                try {
                    await sendNewsletter('book', {
                        title: updatedBook.title,
                        slug: updatedBook.slug,
                        description: updatedBook.description,
                    });
                } catch (error) {
                    console.error('Background email error:', error);
                }
            });
        }

        return NextResponse.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({ error: 'Duplicate slug' }, { status: 409 });
        }
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

        const book = await prisma.book.findUnique({ where: { id } });
        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        await prisma.book.delete({ where: { id } });

        return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}
