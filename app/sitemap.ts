import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { legalPagesEnabled } from '@/lib/legal-identity';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/books`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/programas`,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...[
            'cookies',
            'accesibilidad',
            ...(legalPagesEnabled ? ['aviso-legal', 'privacidad', 'terminos'] : []),
        ].map((path) => ({
            url: `${baseUrl}/${path}`,
            changeFrequency: 'yearly' as const,
            priority: 0.2,
        })),
    ];

    // Fetch independent content collections concurrently.
    const [posts, books] = await Promise.all([
        prisma.post.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        }),
        prisma.book.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        }),
    ]);

    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const libraryBooks: MetadataRoute.Sitemap = books.map((book) => ({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: book.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...blogPosts, ...libraryBooks];
}
