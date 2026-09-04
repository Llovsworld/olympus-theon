import { prisma } from '@/lib/prisma';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import ReadingProgress from '@/components/ReadingProgress';
import ViewTracker from '@/components/ViewTracker';
import SocialShare from '@/components/SocialShare';
import EditorialRichContent from '@/components/EditorialRichContent';
import { Metadata } from 'next';
import Image from 'next/image';
import { getPublishedPostBySlug, getPublishedPostSlugs } from '@/lib/content';
import {
    AUTHOR_NAME,
    AUTHOR_URL,
    DEFAULT_LOCALE,
    SITE_NAME,
    SITE_URL,
    getContentImageUrl,
    getPlainText,
    serializeJsonLd,
} from '@/lib/seo';
import { sanitizePublicRichText, sanitizeRichText } from '@/lib/sanitize-content';

export const revalidate = 3600;

// Pre-render published articles so search visitors do not pay the cost of the
// first database-backed render after each deployment.
export async function generateStaticParams() {
    const slugs = await getPublishedPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

interface BlogPostPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

// Dynamic SEO metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const canonical = `${SITE_URL}/blog/${slug}`;

    if (locale !== 'es') {
        return {
            title: 'Artículo en español',
            alternates: { canonical },
            robots: { index: false, follow: true },
        };
    }

    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post no encontrado',
            robots: { index: false, follow: false },
        };
    }

    // Generate description from excerpt, metaDescription, or content
    const safeContent = sanitizeRichText(post.content);
    const description = post.metaDescription || post.excerpt ||
        `${getPlainText(safeContent).substring(0, 157)}...`;
    const featuredImage = getContentImageUrl(post.featuredImage);
    const socialImage = featuredImage
        ? new URL(featuredImage, SITE_URL).toString()
        : `${SITE_URL}/og.png`;
    const socialImages = featuredImage
        ? [{ url: featuredImage, alt: `Portada de ${post.title}` }]
        : [{ url: socialImage, width: 1200, height: 630, alt: SITE_NAME }];

    return {
        title: post.title,
        description,
        authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
        alternates: { canonical },
        openGraph: {
            title: `${post.title} | Olympus Theon`,
            description,
            type: 'article',
            url: canonical,
            siteName: SITE_NAME,
            locale: DEFAULT_LOCALE,
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: [AUTHOR_URL],
            section: post.categories[0] || undefined,
            images: socialImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [socialImage],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;
    if (locale !== 'es') {
        permanentRedirect(`/blog/${slug}`);
    }

    // The recommendations only depend on the slug, so both reads can start at
    // once instead of forming a database waterfall.
    const [post, otherPosts] = await Promise.all([
        getPublishedPostBySlug(slug),
        prisma.post.findMany({
            where: {
                published: true,
                NOT: { slug },
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                featuredImage: true,
                createdAt: true,
            },
        }),
    ]);

    if (!post) {
        notFound();
    }

    // Calculate reading time (200 words per minute average)
    const safeContent = sanitizeRichText(post.content);
    const publicContent = sanitizePublicRichText(post.content);
    const featuredImage = getContentImageUrl(post.featuredImage);
    const structuredDataImage = featuredImage
        ? new URL(featuredImage, SITE_URL).toString()
        : `${SITE_URL}/og.png`;
    const wordCount = getPlainText(safeContent).split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200);
    const showModifiedDate = post.updatedAt.getTime() - post.createdAt.getTime() > 86_400_000;
    const canonical = `${SITE_URL}/blog/${slug}`;
    const description = post.metaDescription || post.excerpt || getPlainText(post.content).substring(0, 160);
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${canonical}#article`,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonical,
                },
                headline: post.title,
                description,
                image: [structuredDataImage],
                datePublished: post.createdAt.toISOString(),
                dateModified: post.updatedAt.toISOString(),
                articleSection: post.categories.length > 0 ? post.categories : undefined,
                inLanguage: 'es-ES',
                wordCount,
                author: {
                    '@type': 'Person',
                    '@id': `${SITE_URL}/#alejandro-lloveras`,
                    name: AUTHOR_NAME,
                    url: AUTHOR_URL,
                },
                publisher: {
                    '@id': `${SITE_URL}/#organization`,
                },
                isPartOf: {
                    '@id': `${SITE_URL}/#website`,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonical}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Inicio',
                        item: SITE_URL,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Blog',
                        item: `${SITE_URL}/blog`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: post.title,
                        item: canonical,
                    },
                ],
            },
        ],
    };

    return (
        <div style={{ background: '#050505', minHeight: '100vh', color: '#ededed' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
            />
            <ViewTracker type="post" slug={slug} />
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
                {featuredImage ? (
                    <>
                        <Image
                            src={featuredImage}
                            alt={`Portada del artículo ${post.title}`}
                            fill
                            sizes="100vw"
                            preload
                            style={{
                                objectFit: 'cover',
                                zIndex: 0
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
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #050505 100%)',
                        zIndex: 0
                    }} />
                )}

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '1000px' }}>
                    <Link
                        href="/blog"
                        style={{
                            display: 'inline-block',
                            color: '#FFD700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: '0.8rem',
                            marginBottom: '2rem',
                            fontWeight: 600
                        }}
                    >
                        ← Volver al blog
                    </Link>

                    {post.categories.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {post.categories.map((category) => (
                                <span
                                    key={category}
                                    style={{
                                        color: '#FFD700',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: '2rem',
                        textTransform: 'uppercase',
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        letterSpacing: '-0.02em'
                    }}>
                        {post.title}
                    </h1>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap',
                        fontSize: '0.9rem',
                        color: '#ccc',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        <time dateTime={post.createdAt.toISOString()}>
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        {showModifiedDate && (
                            <>
                                <span aria-hidden="true">•</span>
                                <time dateTime={post.updatedAt.toISOString()}>
                                    Actualizado {new Date(post.updatedAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </>
                        )}
                        <span aria-hidden="true">•</span>
                        <Link href="/#fundador" style={{ color: 'inherit', textDecoration: 'none' }}>
                            {AUTHOR_NAME}
                        </Link>
                        <span aria-hidden="true">•</span>
                        <span>{readingTime} min de lectura</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="container blog-content" style={{
                maxWidth: '740px',
                margin: '0 auto',
                padding: '6rem 1.5rem',
                position: 'relative',
                zIndex: 10
            }}>
                <EditorialRichContent
                    html={publicContent}
                    className="prose prose-invert prose-lg"
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: '#d4d4d4'
                    }}
                />

                <aside style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    border: '1px solid rgba(255, 215, 0, 0.18)',
                    borderRadius: '8px',
                    marginTop: '4rem',
                    padding: '1.75rem'
                }}>
                    <p style={{
                        color: '#FFD700',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase'
                    }}>
                        Sobre el autor
                    </p>
                    <h2 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                        {AUTHOR_NAME}
                    </h2>
                    <p style={{ color: '#bbb', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Fundador de Olympus Theon. Escribe sobre disciplina, fortaleza mental y desarrollo personal desde una perspectiva práctica.
                    </p>
                    <Link href="/#fundador" style={{ color: '#FFD700', fontWeight: 600 }}>
                        Conocer al autor
                    </Link>
                </aside>

                <nav aria-label="Siguiente paso" style={{
                    marginTop: '2rem',
                    padding: '1.75rem',
                    background: '#0d0d0d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                }}>
                    <h2 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                        Continúa trabajando tu fortaleza mental
                    </h2>
                    <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: '1rem' }}>
                        Descubre cómo integramos reprogramación mental, optimización física y dominio espiritual en el método Olympus Theon.
                    </p>
                    <Link href="/#method" style={{ color: '#FFD700', fontWeight: 600 }}>
                        Conocer el método
                    </Link>
                </nav>

                {/* Social Share Section */}
                <div style={{
                    marginTop: '4rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <SocialShare
                        url={canonical}
                        title={post.title}
                        description={post.metaDescription || post.excerpt || undefined}
                    />
                </div>
            </article>

            {/* Read Next Section */}
            {otherPosts.length > 0 && (
                <section style={{
                    padding: '6rem 0',
                    borderTop: '1px solid #1f1f1f',
                    background: '#0a0a0a'
                }}>
                    <div className="container">
                        <h2 style={{
                            fontSize: '2rem',
                            textAlign: 'center',
                            marginBottom: '3rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Sigue leyendo
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {otherPosts.map(p => (
                                <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: '#111',
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                        height: '100%',
                                        transition: 'transform 0.3s'
                                    }}
                                        className="hover:translate-y-[-5px]"
                                    >
                                        {getContentImageUrl(p.featuredImage) && (
                                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                                <Image
                                                    src={getContentImageUrl(p.featuredImage)!}
                                                    alt={`Portada del artículo ${p.title}`}
                                                    fill
                                                    sizes="(max-width: 700px) calc(100vw - 4rem), 33vw"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h4>
                                            <p style={{ color: '#888', fontSize: '0.9rem' }}>
                                                <time dateTime={p.createdAt.toISOString()}>
                                                    {new Date(p.createdAt).toLocaleDateString('es-ES')}
                                                </time>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
