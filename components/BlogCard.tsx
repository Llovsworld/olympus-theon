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
            className="blog-card-link"
        >
            <article
                className="blog-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 4px 10px rgba(0,0,0,0.2)'
                }}
            >
                {post.featuredImage && (
                    <div className="blog-card-image">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            style={{
                                transform: isHovered ? 'scale(1.08)' : 'scale(1)'
                            }}
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

