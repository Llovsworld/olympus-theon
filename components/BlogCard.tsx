"use client";

import Link from 'next/link';
import { useState } from 'react';

interface BlogCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        content: string;
        featuredImage: string | null;
        createdAt: Date;
    };
}

function getPlainTextExcerpt(html: string, maxLength: number = 150): string {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export default function BlogCard({ post }: BlogCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={`/blog/${post.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
        >
            <article
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 4px 10px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
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
                                objectFit: 'cover',
                                transition: 'transform 0.6s ease',
                                transform: isHovered ? 'scale(1.08)' : 'scale(1)'
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
                    padding: '1.75rem 1.5rem', // Reduced padding significantly
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    alignItems: 'center'
                }}>
                    <h2 style={{
                        fontSize: '1.2rem', // Smaller title
                        fontWeight: '700',
                        marginBottom: '0.75rem', // Less margin
                        lineHeight: '1.3',
                        color: '#fff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                    }}>
                        {post.title}
                    </h2>

                    <p style={{
                        color: '#aaa',
                        lineHeight: '1.5', // Tighter line height
                        marginBottom: '1.5rem', // Less margin
                        flex: 1,
                        fontSize: '0.9rem', // Smaller font
                        maxWidth: '90%'
                    }}>
                        {getPlainTextExcerpt(post.content, 100)} {/* Shorter excerpt */}
                    </p>

                    <div style={{
                        marginTop: 'auto',
                        paddingTop: '1rem', // Less padding
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
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
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
                            {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
