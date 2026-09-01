"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import type { ContentCategory } from '@/lib/content-categories';

interface BookCardProps {
    book: {
        id: string;
        title: string;
        slug: string;
        author: string | null;
        category: ContentCategory | null;
        description: string;
        coverImage: string | null;
    };
}

function BookCard({ book }: BookCardProps) {
    return (
        <Link href={`/books/${book.slug}`} className="blog-card-link">
            <article className="blog-card glass-card">
                {book.coverImage ? (
                    <div className="blog-card-image" style={{ aspectRatio: '2/3' }}>
                        <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            sizes="(max-width: 700px) calc(100vw - 3rem), (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            style={{ objectFit: 'cover' }}
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
                    {book.category && (
                        <span style={{
                            color: '#FFD700',
                            display: 'block',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            marginBottom: '0.6rem',
                            textTransform: 'uppercase'
                        }}>
                            {book.category}
                        </span>
                    )}
                    {book.author && (
                        <span style={{
                            color: '#aaa',
                            display: 'block',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase'
                        }}>
                            {book.author}
                        </span>
                    )}
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
