export const SITE_NAME = 'Olympus Theon';
export const SITE_URL = 'https://www.olympustheon.com';
export const DEFAULT_LOCALE = 'es_ES';
export const AUTHOR_NAME = 'Alejandro Lloveras Sauras';
export const AUTHOR_URL = `${SITE_URL}/#fundador`;

export function getContentImageUrl(value: string | null | undefined) {
    if (!value) return null;

    try {
        const url = new URL(value, SITE_URL);
        const isOwnDomain = url.hostname === 'olympustheon.com' || url.hostname === 'www.olympustheon.com';
        const isVercelBlob = url.hostname.endsWith('.vercel-storage.com');

        return url.protocol === 'https:' && (isOwnDomain || isVercelBlob)
            ? url.toString()
            : null;
    } catch {
        return null;
    }
}

export function getPlainText(html: string) {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export function serializeJsonLd(value: unknown) {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}
