import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getContentImageUrl } from '@/lib/seo';
import { normalizeSearchText } from '@/lib/search';
import { getCanonicalPostCategory } from '@/lib/post-categories';
import { getCanonicalContentCategory } from '@/lib/content-categories';

function getPlainText(html: string) {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#(?:39|x27);/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function getPlainTextExcerpt(html: string, maxLength: number) {
    const text = getPlainText(html);
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function getReadingTime(html: string) {
    return Math.max(Math.ceil(getPlainText(html).split(/\s+/).length / 200), 1);
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
            excerpt: true,
            category: true,
            featuredImage: true,
            createdAt: true,
        },
    });

    return posts.map(({ content, excerpt, ...post }) => {
        const resolvedExcerpt = excerpt || getPlainTextExcerpt(content, 160);
        const fullText = getPlainText(content);
        const category = getCanonicalPostCategory(post.category);

        return {
            ...post,
            category,
            featuredImage: getContentImageUrl(post.featuredImage),
            excerpt: resolvedExcerpt,
            searchText: normalizeSearchText([
                post.title,
                category || '',
                resolvedExcerpt,
                fullText,
            ].join(' ')),
            readingTime: getReadingTime(content),
        };
    });
}

export async function getPublishedBookList() {
    const books = await prisma.book.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            author: true,
            category: true,
            description: true,
            content: true,
            coverImage: true,
            createdAt: true,
        },
    });

    return books.map(({ content, ...book }) => {
        const fullText = content ? getPlainText(content) : '';
        const category = getCanonicalContentCategory(book.category);

        return {
            ...book,
            category,
            searchText: normalizeSearchText([
                book.title,
                book.author || '',
                category || '',
                book.description,
                fullText,
            ].join(' ')),
            readingTime: content ? getReadingTime(content) : null,
        };
    });
}

/**
 * Keep build-time route generation lightweight: detail pages only need the
 * published slugs, not the full article or review bodies.
 */
export const getPublishedPostSlugs = cache(async () => {
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return posts.map(({ slug }) => slug);
});

export const getPublishedBookSlugs = cache(async () => {
    const books = await prisma.book.findMany({
        where: { published: true },
        select: { slug: true },
    });

    return books.map(({ slug }) => slug);
});

/**
 * React cache deduplicates the Prisma read shared by generateMetadata and the
 * page during the same render. Route-level revalidation handles reuse across
 * requests.
 */
export const getPublishedPostBySlug = cache(async (slug: string) => {
    const post = await prisma.post.findUnique({
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
            category: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return post
        ? { ...post, category: getCanonicalPostCategory(post.category) }
        : null;
});

export const getPublishedBookBySlug = cache(async (slug: string) => {
    const book = await prisma.book.findUnique({
        where: {
            slug,
            published: true,
        },
        select: {
            title: true,
            slug: true,
            author: true,
            category: true,
            description: true,
            content: true,
            coverImage: true,
            link: true,
            createdAt: true,
        },
    });

    return book
        ? { ...book, category: getCanonicalContentCategory(book.category) }
        : null;
});
