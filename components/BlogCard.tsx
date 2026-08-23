"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';

interface BlogCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        category: string | null;
        featuredImage: string | null;
        createdAt: Date;
        excerpt: string;
        readingTime: number;
    };
}

function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="blog-card-link"
        >
            <article className="blog-card glass-card">
                {post.featuredImage && (
                    <div className="blog-card-image">
                        <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            sizes="(max-width: 700px) calc(100vw - 3rem), (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            style={{ objectFit: 'cover' }}
                        />
                        <div className="blog-card-image-overlay" />
                    </div>
                )}

                <div className="blog-card-content">
                    {post.category && (
                        <span style={{
                            color: '#FFD700',
                            display: 'inline-block',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase'
                        }}>
                            {post.category}
                        </span>
                    )}
                    <h2 className="blog-card-title">
                        {post.title}
                    </h2>

                    <p className="blog-card-excerpt">
                        {post.excerpt}
                    </p>

                    <div className="blog-card-meta">
                        <time className="blog-card-date" dateTime={new Date(post.createdAt).toISOString()}>
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </time>
                        <span className="blog-card-separator">•</span>
                        <span className="blog-card-reading-time">
                            {post.readingTime} min
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default memo(BlogCard);
