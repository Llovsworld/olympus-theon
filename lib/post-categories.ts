import {
    CONTENT_CATEGORIES,
    getCanonicalContentCategory,
    getContentCategoryDefinition,
    getContentCategoryKey,
} from '@/lib/content-categories';
import type { ContentCategory } from '@/lib/content-categories';

export const POST_CATEGORIES = CONTENT_CATEGORIES;

export type PostCategory = ContentCategory;

export const getCanonicalPostCategory = getCanonicalContentCategory;
export const getPostCategoryDefinition = getContentCategoryDefinition;
export const getPostCategoryKey = getContentCategoryKey;

/**
 * Post categories are a fixed, code-controlled taxonomy. Normalize, de-duplicate
 * and preserve the editorial order supplied by the author.
 */
export function getCanonicalPostCategories(value: unknown): PostCategory[] {
    const values = Array.isArray(value) ? value : [value];
    const categories: PostCategory[] = [];

    for (const item of values) {
        const category = getCanonicalPostCategory(item);
        if (category && !categories.includes(category)) {
            categories.push(category);
        }
    }

    return categories;
}

/** The array field is authoritative; the singular field remains a rollback-safe fallback. */
export function resolvePostCategories(value: unknown, legacyCategory?: unknown): PostCategory[] {
    const categories = getCanonicalPostCategories(value);
    if (categories.length > 0) return categories;

    return getCanonicalPostCategories(legacyCategory);
}

export function isValidPostCategorySelection(value: unknown): value is string[] {
    return Array.isArray(value)
        && value.every((item) => typeof item === 'string' && Boolean(getCanonicalPostCategory(item)));
}

export function getPostCategoryKeys(value: unknown) {
    return getCanonicalPostCategories(value).map(getPostCategoryKey).filter(Boolean);
}
