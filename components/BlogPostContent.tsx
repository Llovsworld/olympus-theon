"use client";

import Link from 'next/link';

interface Post {
    slug: string;
    title: string;
    content: string;
    featuredImage: string | null;
    createdAt: Date;
}

export default function BlogPostContent({ post }: { post: Post }) {
    return (
        <article className="container" style={{ padding: '6rem 0', maxWidth: '900px', margin: '0 auto' }}>
            <Link
                href="/blog"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#FFD700',
                    textDecoration: 'none',
                    marginBottom: '3rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'gap 0.3s'
                }}
            >
                ← Volver al blog
            </Link>

            {post.featuredImage && (
                <div style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '3rem',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,165,0,0.1) 100%)'
                }}>
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            )}

            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {post.title}
                </h1>
                <time style={{
                    color: '#888',
                    fontSize: '1rem',
                    display: 'block'
                }}>
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </time>
            </header>

            <div
                className="prose prose-invert max-w-none"
                style={{
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    color: '#ccc'
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <style jsx global>{`
                .prose h1, .prose h2, .prose h3 {
                    color: #fff;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .prose h1 { font-size: 2.5rem; }
                .prose h2 { font-size: 2rem; }
                .prose h3 { font-size: 1.5rem; }
                .prose p {
                    margin-bottom: 1.5rem;
                }
                .prose img {
                    border-radius: 8px;
                    margin: 2rem 0;
                }
                .prose a {
                    color: #FFD700;
                    text-decoration: underline;
                    transition: color 0.2s;
                }
                .prose a:hover {
                    color: #FFA500;
                }
                .prose blockquote {
                    border-left: 4px solid #FFD700;
                    padding-left: 1.5rem;
                    margin: 2rem 0;
                    font-style: italic;
                    color: #aaa;
                }
                .prose code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-size: 0.9em;
                }
                .prose pre {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 2rem 0;
                }
                .prose ul, .prose ol {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                }
                .prose li {
                    margin: 0.5rem 0;
                }
            `}</style>
        </article>
    );
}
