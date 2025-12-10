'use client';

import { useState, useMemo } from 'react';
import { Post } from '@prisma/client';
import BlogCard from './BlogCard';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';

interface BlogListProps {
    posts: Post[];
}

function getPlainTextExcerpt(html: string, maxLength: number = 150): string {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function BlogList({ posts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) return posts;

        const query = searchQuery.toLowerCase();
        return posts.filter(post =>
            post.title.toLowerCase().includes(query) ||
            getPlainTextExcerpt(post.content, 1000).toLowerCase().includes(query)
        );
    }, [posts, searchQuery]);

    return (
        <div>
            {/* Search Bar */}
            <div style={{
                maxWidth: '600px',
                margin: '0 auto 4rem',
                position: 'relative'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '1.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '50px',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                    }}
                    className="focus:border-yellow-500/50 focus:bg-white/10"
                />
            </div>

            {/* Posts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
                marginTop: '0'
            }}>
                {filteredPosts.map((post, index) => {
                    // Only show featured style for the very first post AND if there is no search query
                    const isFeatured = index === 0 && !searchQuery;

                    if (isFeatured) {
                        return (
                            <ScrollReveal key={post.id} variant="fade">
                                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                                    <article
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 215, 0, 0.3)', // Gold border for featured
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                            cursor: 'pointer',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {/* Featured Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            background: '#FFD700',
                                            color: '#000',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            zIndex: 10,
                                            borderRadius: '2px'
                                        }}>
                                            Destacado
                                        </div>

                                        {post.featuredImage && (
                                            <div style={{
                                                width: '100%',
                                                aspectRatio: '16/9',
                                                overflow: 'hidden',
                                                position: 'relative'
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
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
                                                    opacity: 0.5
                                                }} />
                                            </div>
                                        )}

                                        <div style={{
                                            padding: '1.75rem 1.5rem',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            textAlign: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <h2 style={{
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                marginBottom: '0.75rem',
                                                lineHeight: '1.3',
                                                color: '#fff',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.02em'
                                            }}>
                                                {post.title}
                                            </h2>

                                            <p style={{
                                                color: '#aaa',
                                                lineHeight: '1.5',
                                                marginBottom: '1.5rem',
                                                flex: 1,
                                                fontSize: '0.9rem',
                                                maxWidth: '90%'
                                            }}>
                                                {getPlainTextExcerpt(post.content, 100)}
                                            </p>

                                            <div style={{
                                                marginTop: 'auto',
                                                paddingTop: '1rem',
                                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}>
                                                <time style={{
                                                    color: '#666',
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    fontWeight: 600
                                                }}>
                                                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </time>
                                                <span style={{ color: '#444' }}>•</span>
                                                <span style={{
                                                    color: '#FFD700',
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    fontWeight: 600
                                                }}>
                                                    {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min de lectura
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </ScrollReveal>
                        );
                    }

                    return (
                        <ScrollReveal key={post.id} variant="slide" delay={index * 50}>
                            <BlogCard post={post} />
                        </ScrollReveal>
                    );
                })}

                {filteredPosts.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '4rem 0',
                        color: '#888'
                    }}>
                        <p style={{ fontSize: '1.2rem' }}>No se encontraron artículos.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
