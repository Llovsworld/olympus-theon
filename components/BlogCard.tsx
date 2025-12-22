"use client";

import Link from 'next/link';
import { memo } from 'react';

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

function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="blog-card-link"
        >
            <article className="blog-card">
                {post.featuredImage && (
                    <div className="blog-card-image">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="blog-card-image-overlay" />
                    </div>
                )}

                <div className="blog-card-content">
                    <h2 className="blog-card-title">
                        {post.title}
                    </h2>

                    <p className="blog-card-excerpt">
                        {getPlainTextExcerpt(post.content, 100)}
                    </p>

                    <div className="blog-card-meta">
                        <time className="blog-card-date">
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </time>
                        <span className="blog-card-separator">•</span>
                        <span className="blog-card-reading-time">
                            {Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default memo(BlogCard);
