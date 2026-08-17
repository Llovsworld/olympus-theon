import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletter } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseBookInput } from '@/lib/content-input';
import { parsePagination, readJsonObject, RequestValidationError } from '@/lib/validation';
import { after } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeAll = searchParams.get('all') === 'true';

        if (includeAll) {
            const session = await getServerSession(authOptions);
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const pagination = parsePagination(searchParams);

        const books = await prisma.book.findMany({
            where: includeAll ? {} : { published: true },
            orderBy: { createdAt: 'desc' },
            ...pagination,
        });
        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const input = parseBookInput(await readJsonObject(request));

        // Check for duplicate slug
        const existingBook = await prisma.book.findUnique({
            where: { slug: input.slug },
        });

        if (existingBook) {
            return NextResponse.json(
                { error: 'Duplicate slug', details: `The slug "${input.slug}" is already in use.` },
                { status: 409 }
            );
        }

        const book = await prisma.book.create({
            data: input,
        });

        // Trigger Newsletter if published
        if (book.published) {
            after(async () => {
                try {
                    await sendNewsletter('book', {
                        title: book.title,
                        slug: book.slug,
                        description: book.description,
                    });
                } catch (error) {
                    console.error('Background email error:', error);
                }
            });
        }

        return NextResponse.json(book, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);

        if (error instanceof RequestValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Duplicate slug', details: 'The provided slug is already in use.' },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
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

        return NextResponse.json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
    }
}
