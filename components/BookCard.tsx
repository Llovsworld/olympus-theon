"use client";

import Link from 'next/link';
import { useState } from 'react';

interface BookCardProps {
    book: {
        id: string;
        title: string;
        slug: string;
        description: string;
        coverImage: string | null;
        link: string | null;
    };
}

export default function BookCard({ book }: BookCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href={`/books/${book.slug}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
            <article
                style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    borderColor: isHovered ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : 'none'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {book.coverImage ? (
                    <div style={{
                        width: '100%',
                        aspectRatio: '2/3', // Standard book ratio
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            loading="lazy"
                            decoding="async"
                            width="600"
                            height="900"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
                            opacity: 0.6
                        }} />
                    </div>
                ) : (
                    <div style={{
                        width: '100%',
                        aspectRatio: '2/3',
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#333'
                    }}>
                        <span style={{ fontSize: '3rem' }}>📚</span>
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
                        {book.title}
                    </h2>

                    <p style={{
                        color: '#aaa',
                        lineHeight: '1.5',
                        marginBottom: '1.5rem',
                        flex: 1,
                        fontSize: '0.9rem',
                        maxWidth: '90%'
                    }}>
                        {book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description}
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
                            {new Date().getFullYear()} {/* Or createdAt if available in props */}
                        </time>
                        {/* We need content to calculate reading time, assuming it might be passed or we use description as fallback */}
                        <span style={{ color: '#444' }}>•</span>
                        <span style={{
                            color: '#FFD700',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontWeight: 600
                        }}>
                            Ver detalles →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
