import { revalidatePath } from 'next/cache';

export function revalidateBlogContent() {
    revalidatePath('/[locale]/blog', 'page');
    revalidatePath('/[locale]/blog/[slug]', 'page');
    revalidatePath('/sitemap.xml');
}

export function revalidateBookContent() {
    revalidatePath('/[locale]/books', 'page');
    revalidatePath('/[locale]/books/[slug]', 'page');
    revalidatePath('/sitemap.xml');
}
