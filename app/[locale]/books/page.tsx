import BookList from '@/components/BookList';
import { Metadata } from 'next';
import { getPublishedBookList } from '@/lib/content';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
    title: "Biblioteca",
    description: "Conocimiento esencial para el hombre moderno. Libros sobre desarrollo personal, filosofía estoica y alto rendimiento.",
    alternates: { canonical: `${SITE_URL}/books` },
    openGraph: {
        title: "Biblioteca | Olympus Theon",
        description: "Libros sobre desarrollo personal, filosofía estoica y alto rendimiento.",
        url: `${SITE_URL}/books`,
        siteName: SITE_NAME,
        locale: DEFAULT_LOCALE,
        images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Biblioteca | Olympus Theon',
        description: 'Libros sobre desarrollo personal, filosofía estoica y alto rendimiento.',
        images: [`${SITE_URL}/og.png`],
    },
};

export const revalidate = 300;

export default async function BooksPage() {
    const books = await getPublishedBookList();

    return (
        <div style={{ minHeight: '100vh', background: '#050505' }}>
            {/* Header Section with Background */}
            {/* Header Section with Background */}
            <div className="page-hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url("/snake-bg.webp")'
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
