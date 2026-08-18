import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://olympustheon.com';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/books`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/programas`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Fetch independent content collections concurrently.
    const [postsResult, booksResult] = await Promise.allSettled([
        prisma.post.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        }),
        prisma.book.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        }),
    ]);

    let blogPosts: MetadataRoute.Sitemap = [];
    if (postsResult.status === 'fulfilled') {
        blogPosts = postsResult.value.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } else {
        console.error('Error fetching posts for sitemap:', postsResult.reason);
    }

    let books: MetadataRoute.Sitemap = [];
    if (booksResult.status === 'fulfilled') {
        books = booksResult.value.map((book) => ({
            url: `${baseUrl}/books/${book.slug}`,
            lastModified: book.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } else {
        console.error('Error fetching books for sitemap:', booksResult.reason);
    }

    return [...staticPages, ...blogPosts, ...books];
}
