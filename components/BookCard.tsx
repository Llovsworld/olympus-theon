"use client";

import Link from 'next/link';
import { memo } from 'react';

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

function BookCard({ book }: BookCardProps) {
    return (
        <Link href={`/books/${book.slug}`} className="blog-card-link">
            <article className="blog-card">
                {book.coverImage ? (
                    <div className="blog-card-image" style={{ aspectRatio: '2/3' }}>
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            loading="lazy"
                            decoding="async"
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

export default memo(BookCard);


