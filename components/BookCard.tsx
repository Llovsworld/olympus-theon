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
        <Link href={`/books/${book.slug}`} className="blog-card-link">
            <article
                className="blog-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    borderColor: isHovered ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : 'none'
                }}
            >
                {book.coverImage ? (
                    <div className="blog-card-image" style={{ aspectRatio: '2/3' }}>
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            loading="lazy"
                            decoding="async"
                            style={{
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                            }}
                        />
                        <div className="blog-card-image-overlay" />
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

                <div className="blog-card-content">
                    <h2 className="blog-card-title">
                        {book.title}
                    </h2>

                    <p className="blog-card-excerpt">
                        {book.description.length > 100 ? book.description.substring(0, 100) + '...' : book.description}
                    </p>

                    <div className="blog-card-meta">
                        <span className="blog-card-reading-time">
                            Ver detalles →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

