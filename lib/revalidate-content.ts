import { revalidatePath } from 'next/cache';

export function revalidateBlogContent(...slugs: Array<string | undefined>) {
    revalidatePath('/blog');
    revalidatePath('/[locale]/blog', 'page');
    revalidatePath('/[locale]/blog/[slug]', 'page');
    for (const slug of new Set(slugs.filter((value): value is string => Boolean(value)))) {
        revalidatePath(`/blog/${slug}`);
    }
    revalidatePath('/sitemap.xml');
}

export function revalidateBookContent() {
    revalidatePath('/[locale]/books', 'page');
    revalidatePath('/[locale]/books/[slug]', 'page');
    revalidatePath('/sitemap.xml');
}
