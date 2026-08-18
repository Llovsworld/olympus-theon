import { cache } from 'react';
import { prisma } from '@/lib/prisma';

function getPlainTextExcerpt(html: string, maxLength: number) {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function getReadingTime(html: string) {
    return Math.ceil(html.replace(/<[^>]*>/g, '').split(/\s+/).length / 200);
}

export async function getPublishedPostList() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            featuredImage: true,
            createdAt: true,
        },
    });

    return posts.map(({ content, ...post }) => ({
        ...post,
        excerpt: getPlainTextExcerpt(content, 100),
        searchText: getPlainTextExcerpt(content, 1000).toLowerCase(),
        readingTime: getReadingTime(content),
    }));
}

export async function getPublishedBookList() {
    const books = await prisma.book.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            content: true,
            coverImage: true,
            createdAt: true,
        },
    });

    return books.map(({ content, ...book }) => ({
        ...book,
        contentSearchText: content
            ? getPlainTextExcerpt(content, 1000).toLowerCase()
            : null,
        readingTime: content ? getReadingTime(content) : null,
    }));
}

/**
 * React cache deduplicates the Prisma read shared by generateMetadata and the
 * page during the same render. Route-level revalidation handles reuse across
 * requests.
 */
export const getPublishedPostBySlug = cache(async (slug: string) =>
    prisma.post.findUnique({
        where: {
            slug,
            published: true,
        },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            excerpt: true,
            metaDescription: true,
            featuredImage: true,
            createdAt: true,
        },
    })
);

export const getPublishedBookBySlug = cache(async (slug: string) =>
    prisma.book.findUnique({
        where: {
            slug,
            published: true,
        },
        select: {
            title: true,
            slug: true,
            author: true,
            description: true,
            content: true,
            coverImage: true,
            link: true,
            createdAt: true,
        },
    })
);
