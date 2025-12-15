import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

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

    // Dynamic blog posts
    let blogPosts: MetadataRoute.Sitemap = [];
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        });

        blogPosts = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error);
    }

    // Dynamic books
    let books: MetadataRoute.Sitemap = [];
    try {
        const bookList = await prisma.book.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        });

        books = bookList.map((book) => ({
            url: `${baseUrl}/books/${book.slug}`,
            lastModified: book.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Error fetching books for sitemap:', error);
    }

    return [...staticPages, ...blogPosts, ...books];
}
