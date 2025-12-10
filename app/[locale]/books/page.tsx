import { prisma } from '@/lib/prisma';
import BookList from '@/components/BookList';

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
    const books = await prisma.book.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {/* Header Section with Background */}
            <div style={{
                padding: '10rem 0 6rem',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("/snake_bg_user.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                marginBottom: '4rem',
                borderBottom: '1px solid #1f1f1f'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(255, 255, 255, 0.1)'
                    }}>
                        BIBLIOTECA
                    </h1>
                    <p style={{
                        color: '#ccc',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
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
