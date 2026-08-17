import { sanitizeRichHtml } from '@/lib/sanitize-html';
import {
    normalizeOptionalHttpUrl,
    normalizeOptionalImageUrl,
    normalizeSlug,
    readBoolean,
    readString,
    RequestValidationError,
    type JsonObject,
} from '@/lib/validation';

const MAX_CONTENT_LENGTH = 1_000_000;

function sanitizeContent(value: string): string {
    return sanitizeRichHtml(value);
}

function hasRenderableContent(value: string): boolean {
    const text = value
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|&#160;/gi, ' ')
        .trim();
    return text.length > 0 || /<(?:img|iframe)\b/i.test(value);
}

export function parsePostInput(body: JsonObject, publishedFallback = false) {
    const title = readString(body, 'title', { required: true, maxLength: 200 });
    const rawContent = readString(body, 'content', {
        required: true,
        allowEmpty: true,
        trim: false,
        maxLength: MAX_CONTENT_LENGTH,
    });
    const published = readBoolean(body, 'published', publishedFallback);
    const content = sanitizeContent(rawContent ?? '');

    if (published && !hasRenderableContent(content)) {
        throw new RequestValidationError('content is required when publishing a post');
    }

    return {
        title: title!,
        slug: normalizeSlug(body.slug),
        content,
        excerpt: readString(body, 'excerpt', { maxLength: 500 }),
        metaDescription: readString(body, 'metaDescription', { maxLength: 320 }),
        category: readString(body, 'category', { maxLength: 100 }),
        featuredImage: normalizeOptionalImageUrl(body.featuredImage, 'featuredImage'),
        published,
    };
}

export function parseBookInput(body: JsonObject, publishedFallback = false) {
    const title = readString(body, 'title', { required: true, maxLength: 200 });
    const description = readString(body, 'description', {
        required: true,
        allowEmpty: true,
        maxLength: 2_000,
    }) ?? '';
    const rawContent = readString(body, 'content', {
        allowEmpty: true,
        trim: false,
        maxLength: MAX_CONTENT_LENGTH,
    });

    const published = readBoolean(body, 'published', publishedFallback);
    if (published && description.length === 0) {
        throw new RequestValidationError('description is required when publishing a book');
    }

    return {
        title: title!,
        slug: normalizeSlug(body.slug),
        author: readString(body, 'author', { maxLength: 200 }),
        description,
        content: rawContent ? sanitizeContent(rawContent) || null : null,
        coverImage: normalizeOptionalImageUrl(body.coverImage, 'coverImage'),
        link: normalizeOptionalHttpUrl(body.link, 'link'),
        published,
    };
}
