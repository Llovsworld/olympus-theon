import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if book exists
        const book = await prisma.book.findUnique({
            where: { id: parseInt(id) },
        });

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Delete the book
        await prisma.book.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { message: 'Book deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: 'Failed to delete book' },
            { status: 500 }
        );
    }
}
