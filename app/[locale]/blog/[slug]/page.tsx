import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import ReadingProgress from '@/components/ReadingProgress';
import ViewTracker from '@/components/ViewTracker';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post || !post.published) {
        notFound();
    }

    // Fetch other posts for "Read Next"
    const otherPosts = await prisma.post.findMany({
        where: {
            published: true,
            NOT: { id: post.id }
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    // Calculate reading time (200 words per minute average)
    const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div style={{ background: '#050505', minHeight: '100vh', color: '#ededed' }}>
            <ViewTracker type="post" slug={slug} />
            <ReadingProgress totalReadingTime={readingTime} />
            {/* Immersive Hero Section */}
            <div style={{
                position: 'relative',
                height: '80vh',
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {post.featuredImage ? (
                    <>
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
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
                    <ScrollReveal variant="fade" direction="up">
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
                            ← Volver al Blog
                        </Link>
                    </ScrollReveal>

                    <ScrollReveal variant="scale" delay={200}>
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
                    </ScrollReveal>

                    <ScrollReveal variant="fade" delay={400}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            fontSize: '0.9rem',
                            color: '#ccc',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            <time>
                                {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                            <span>•</span>
                            <span>Olympus Theon</span>
                        </div>
                    </ScrollReveal>
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
                <div
                    className="prose prose-invert prose-lg"
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: '#d4d4d4'
                    }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            {/* Read Next Section */}
            {otherPosts.length > 0 && (
                <section style={{
                    padding: '6rem 0',
                    borderTop: '1px solid #1f1f1f',
                    background: '#0a0a0a'
                }}>
                    <div className="container">
                        <h3 style={{
                            fontSize: '2rem',
                            textAlign: 'center',
                            marginBottom: '3rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Sigue leyendo
                        </h3>
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
                                        {p.featuredImage && (
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img src={p.featuredImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '1.5rem' }}>
                                            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h4>
                                            <p style={{ color: '#888', fontSize: '0.9rem' }}>
                                                {new Date(p.createdAt).toLocaleDateString()}
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

