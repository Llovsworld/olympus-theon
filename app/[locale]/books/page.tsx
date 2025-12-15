import { prisma } from '@/lib/prisma';
import BookList from '@/components/BookList';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Biblioteca",
    description: "Conocimiento esencial para el hombre moderno. Libros sobre desarrollo personal, filosofía estoica y alto rendimiento.",
    openGraph: {
        title: "Biblioteca | Olympus Theon",
        description: "Libros sobre desarrollo personal, filosofía estoica y alto rendimiento.",
    },
};

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
    const books = await prisma.book.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {/* Header Section with Background */}
            {/* Header Section with Background */}
            <div className="page-hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("/snake_bg_user.jpg")'
            }}>
                <div className="container">
                    <h1 className="page-hero-title">
                        BIBLIOTECA
                    </h1>
                    <p className="page-hero-subtitle">
                        Conocimiento esencial para el hombre moderno.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto' }}>
                <BookList books={books} />
            </div>
        </div>
    );
}
