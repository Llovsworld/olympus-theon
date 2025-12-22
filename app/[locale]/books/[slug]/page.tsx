import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import ReadingProgress from '@/components/ReadingProgress';
import ViewTracker from '@/components/ViewTracker';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BookPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Dynamic SEO metadata for each book
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
    const { slug } = await params;

    const book = await prisma.book.findUnique({
        where: { slug },
        select: {
            title: true,
            author: true,
            description: true,
            coverImage: true,
            createdAt: true,
        }
    });

    if (!book) {
        return {
            title: 'Libro no encontrado',
        };
    }

    const description = book.description || `Lee ${book.title} en Olympus Theon`;

    return {
        title: book.title,
        description,
        openGraph: {
            title: `${book.title} | Biblioteca Olympus Theon`,
            description,
            type: 'book',
            authors: book.author ? [book.author] : undefined,
            images: book.coverImage ? [
                {
                    url: book.coverImage,
                    width: 800,
                    height: 1200,
                    alt: book.title,
                }
            ] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: book.title,
            description,
            images: book.coverImage ? [book.coverImage] : undefined,
        },
    };
}

export default async function BookPage({ params }: BookPageProps) {
    const { slug } = await params;

    const book = await prisma.book.findUnique({
        where: { slug },
    });

    if (!book || !book.published) {
        notFound();
    }

    // Calculate reading time (200 words per minute average)
    const wordCount = book.content ? book.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readingTime = Math.max(Math.ceil(wordCount / 200), 1);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#ededed' }}>
            <ViewTracker type="book" slug={slug} />
            <ReadingProgress totalReadingTime={readingTime} />

            {/* Immersive Hero Section */}
            <div style={{
                position: 'relative',
                minHeight: 'calc(100vh - 100px)',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '100px' // Account for sticky header height
            }}>
                {book.coverImage ? (
                    <>
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                                filter: 'blur(10px) brightness(0.5)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.8) 100%)',
                            zIndex: 1
                        }} />
                    </>
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, #1a1a1a 0%, #050505 100%)',
                        zIndex: 0
                    }} />
                )}

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1000px' }}>
                    <ScrollReveal variant="fade" direction="up">
                        <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '50px',
                            color: '#FFD700',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '1.5rem',
                            backdropFilter: 'blur(5px)'
                        }}>
                            Libro
                        </span>
                    </ScrollReveal>

                    <ScrollReveal variant="scale" delay={200}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}>
                            {book.title}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={400}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2rem',
                            color: '#ccc',
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            <span>
                                {new Date(book.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {book.content && (
                                <>
                                    <span style={{ width: '4px', height: '4px', background: '#FFD700', borderRadius: '50%' }} />
                                    <span>
                                        {Math.ceil(book.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min de lectura
                                    </span>
                                </>
                            )}
                        </div>
                    </ScrollReveal>

                    {book.link && (
                        <ScrollReveal variant="fade" delay={600}>
                            <div style={{ marginTop: '3rem' }}>
                                <a
                                    href={book.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn"
                                    style={{
                                        background: '#FFD700',
                                        color: '#000',
                                        border: 'none',
                                        padding: '1rem 2rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Obtener este libro
                                </a>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <article className="container blog-content" style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '6rem 1.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Description (Intro) */}
                <div style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.8',
                    color: '#fff',
                    marginBottom: '4rem',
                    fontStyle: 'italic',
                    borderLeft: '4px solid #FFD700',
                    paddingLeft: '2rem'
                }}>
                    {book.description}
                </div>

                {/* Main Content */}
                {book.content && (
                    <div
                        className="prose prose-invert prose-lg"
                        style={{
                            maxWidth: '100%',
                            color: '#ccc',
                            lineHeight: '1.8'
                        }}
                        dangerouslySetInnerHTML={{ __html: book.content }}
                    />
                )}
            </article>
        </div>
    );
}
