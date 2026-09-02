import { notFound, permanentRedirect } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import ReadingProgress from '@/components/ReadingProgress';
import ViewTracker from '@/components/ViewTracker';
import ConsentRichContent from '@/components/ConsentRichContent';
import BookPurchaseLink from '@/components/BookPurchaseLink';
import { Metadata } from 'next';
import Image from 'next/image';
import { getPublishedBookBySlug } from '@/lib/content';
import {
    DEFAULT_LOCALE,
    getContentImageUrl,
    serializeJsonLd,
    SITE_NAME,
    SITE_URL,
} from '@/lib/seo';
import {
    getSafeExternalHref,
    getTrustedPublicMediaUrl,
    sanitizePublicRichText,
    sanitizeRichText,
} from '@/lib/sanitize-content';

export const revalidate = 300;

// An empty list enables on-demand ISR for slugs without querying the database
// during every deployment build.
export function generateStaticParams() {
    return [];
}

interface BookPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

function isAmazonAffiliateUrl(value: string) {
    try {
        const hostname = new URL(value).hostname.toLowerCase();
        return hostname === 'amzn.to'
            || hostname === 'amazon.es'
            || hostname.endsWith('.amazon.es');
    } catch {
        return false;
    }
}

// Dynamic SEO metadata for each book
export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const canonical = `${SITE_URL}/books/${slug}`;

    if (locale !== 'es') {
        return {
            title: 'Libro en español',
            alternates: { canonical },
            robots: { index: false, follow: true },
        };
    }

    const book = await getPublishedBookBySlug(slug);

    if (!book) {
        return {
            title: 'Libro no encontrado',
            robots: { index: false, follow: false },
        };
    }

    const description = book.description || `Lee ${book.title} en Olympus Theon`;
    const coverImage = getTrustedPublicMediaUrl(book.coverImage) || undefined;

    return {
        title: book.title,
        description,
        authors: book.author ? [{ name: book.author }] : undefined,
        category: book.category || undefined,
        keywords: [
            book.title,
            book.author,
            book.category,
            'reseña de libros',
            'Olympus Theon',
        ].filter((value): value is string => Boolean(value)),
        alternates: { canonical },
        openGraph: {
            title: `${book.title} | Biblioteca Olympus Theon`,
            description,
            type: 'book',
            url: canonical,
            siteName: SITE_NAME,
            locale: DEFAULT_LOCALE,
            authors: book.author ? [book.author] : undefined,
            images: coverImage ? [
                {
                    url: coverImage,
                    width: 800,
                    height: 1200,
                    alt: book.title,
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: book.title,
            description,
            images: coverImage ? [coverImage] : [],
        },
    };
}

export default async function BookPage({ params }: BookPageProps) {
    const { locale, slug } = await params;
    if (locale !== 'es') {
        permanentRedirect(`/books/${slug}`);
    }

    const book = await getPublishedBookBySlug(slug);

    if (!book) {
        notFound();
    }

    const safeContent = book.content ? sanitizeRichText(book.content) : null;
    const publicContent = book.content ? sanitizePublicRichText(book.content) : null;
    const coverImage = getTrustedPublicMediaUrl(book.coverImage);
    const purchaseLink = getSafeExternalHref(book.link);
    const isAmazonAffiliate = purchaseLink ? isAmazonAffiliateUrl(purchaseLink) : false;
    const bookJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: book.title,
        description: book.description,
        author: book.author ? {
            '@type': 'Person',
            name: book.author,
        } : undefined,
        genre: book.category || undefined,
        image: getContentImageUrl(coverImage) || undefined,
        url: `${SITE_URL}/books/${book.slug}`,
    };

    // Calculate reading time (200 words per minute average)
    const wordCount = safeContent ? safeContent.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readingTime = Math.max(Math.ceil(wordCount / 200), 1);

    return (
        <div style={{ minHeight: '100vh', background: '#050505', color: '#ededed' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(bookJsonLd),
                }}
            />
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
                {coverImage ? (
                    <>
                        <Image
                            src={coverImage}
                            alt={book.title}
                            fill
                            sizes="100vw"
                            preload
                            style={{
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
                            {book.category ? `Libro · ${book.category}` : 'Libro'}
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

                    {book.author && (
                        <ScrollReveal variant="fade" delay={300}>
                            <p style={{
                                color: '#ddd',
                                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                                margin: '-0.5rem 0 1.5rem',
                            }}>
                                Por {book.author}
                            </p>
                        </ScrollReveal>
                    )}

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
                            <time dateTime={book.createdAt.toISOString()}>
                                {new Date(book.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            {safeContent && (
                                <>
                                    <span style={{ width: '4px', height: '4px', background: '#FFD700', borderRadius: '50%' }} />
                                    <span>
                                        {Math.ceil(wordCount / 200)} min de lectura
                                    </span>
                                </>
                            )}
                        </div>
                    </ScrollReveal>

                    {purchaseLink && (
                        <ScrollReveal variant="fade" delay={600}>
                            <BookPurchaseLink
                                href={purchaseLink}
                                bookSlug={book.slug}
                                isAmazonAffiliate={isAmazonAffiliate}
                            />
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
                {publicContent && (
                    <ConsentRichContent
                        html={publicContent}
                        className="prose prose-invert prose-lg"
                        style={{
                            maxWidth: '100%',
                            color: '#ccc',
                            lineHeight: '1.8'
                        }}
                    />
                )}
            </article>
        </div>
    );
}
