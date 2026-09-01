import sanitizeHtml from 'sanitize-html';

import { SITE_URL } from '@/lib/seo';

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTNAMES = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
    'youtu.be',
]);

function getYoutubeVideoId(value: string | undefined) {
    if (!value) return null;

    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || !YOUTUBE_HOSTNAMES.has(url.hostname.toLowerCase())) {
            return null;
        }

        let candidate = '';
        if (url.hostname.toLowerCase() === 'youtu.be') {
            candidate = url.pathname.split('/').filter(Boolean)[0] || '';
        } else {
            const pathParts = url.pathname.split('/').filter(Boolean);
            if (pathParts[0] === 'embed' || pathParts[0] === 'shorts') {
                candidate = pathParts[1] || '';
            } else if (url.pathname === '/watch') {
                candidate = url.searchParams.get('v') || '';
            }
        }

        return YOUTUBE_VIDEO_ID.test(candidate) ? candidate : null;
    } catch {
        return null;
    }
}

/**
 * Only first-party files and the project's managed Vercel Blob files may load
 * automatically inside editorial content. Links remain clickable, but unknown
 * media hosts cannot act as tracking pixels or receive a visitor request.
 */
export function getTrustedPublicMediaUrl(value: string | null | undefined) {
    if (!value) return null;

    try {
        const url = new URL(value.trim(), SITE_URL);
        const hostname = url.hostname.toLowerCase();
        const isOwnDomain = hostname === 'olympustheon.com' || hostname === 'www.olympustheon.com';
        const isVercelBlob = hostname.endsWith('.vercel-storage.com');

        if (url.protocol !== 'https:' || url.username || url.password || (!isOwnDomain && !isVercelBlob)) {
            return null;
        }

        return isOwnDomain
            ? `${url.pathname}${url.search}${url.hash}`
            : url.toString();
    } catch {
        return null;
    }
}

/** Only HTTPS destinations can be emitted as public editorial links. */
export function getSafeExternalHref(value: string | null | undefined) {
    if (!value) return null;

    try {
        const url = new URL(value.trim());
        return url.protocol === 'https:' && !url.username && !url.password
            ? url.toString()
            : null;
    } catch {
        return null;
    }
}

const allowedTags = [
    ...sanitizeHtml.defaults.allowedTags,
    'div',
    'figure',
    'figcaption',
    'img',
    'iframe',
    'button',
    'mark',
    's',
    'u',
    'video',
    'source',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
];

function blockedResource(label: string): sanitizeHtml.Tag {
    return {
        tagName: 'span',
        attribs: { class: 'consent-rich-content__blocked-resource' },
        text: label,
    };
}

function getSanitizeOptions(requireYoutubeConsent: boolean): sanitizeHtml.IOptions {
    return {
        allowedTags,
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            '*': ['class', 'style'],
            a: ['href', 'name', 'target', 'rel', 'title'],
            button: ['type', 'class', 'data-youtube-consent', 'data-youtube-id', 'aria-label'],
            div: ['class', 'style', 'data-youtube-video'],
            img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class', 'data-align'],
            iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'class', 'loading', 'referrerpolicy'],
            video: ['src', 'controls', 'width', 'height', 'poster', 'preload', 'class'],
            source: ['src', 'type'],
            th: ['colspan', 'rowspan', 'scope', 'style', 'class'],
            td: ['colspan', 'rowspan', 'style', 'class'],
        },
        allowedSchemes: ['https', 'mailto', 'tel'],
        allowProtocolRelative: false,
        allowedSchemesByTag: {
            img: ['https'],
            iframe: ['https'],
            video: ['https'],
            source: ['https'],
        },
        allowedIframeHostnames: [
            'www.youtube-nocookie.com',
            'youtube-nocookie.com',
        ],
        allowedStyles: {
            '*': {
                'text-align': [/^(left|center|right|justify)$/],
            },
            img: {
                display: [/^(block|inline|inline-block)$/],
                float: [/^(left|right|none)$/],
                width: [/^\d+(?:\.\d+)?(?:px|%)$/],
                height: [/^(?:auto|\d+(?:\.\d+)?(?:px|%))$/],
                'max-width': [/^100%$/],
                margin: [/^(?:0|auto|\d+(?:\.\d+)?(?:rem|px))(?:\s+(?:0|auto|\d+(?:\.\d+)?(?:rem|px))){0,3}$/],
                'margin-left': [/^(?:auto|\d+(?:\.\d+)?(?:rem|px))$/],
                'margin-right': [/^(?:auto|\d+(?:\.\d+)?(?:rem|px))$/],
                'margin-bottom': [/^\d+(?:\.\d+)?(?:rem|px)$/],
            },
        },
        transformTags: {
            a: (tagName, attribs) => ({
                tagName,
                attribs: attribs.target === '_blank'
                    ? { ...attribs, rel: 'noopener noreferrer' }
                    : attribs,
            }),
            img: (tagName, attribs) => {
                const src = getTrustedPublicMediaUrl(attribs.src);
                return src
                    ? { tagName, attribs: { ...attribs, src } }
                    : blockedResource('Imagen externa bloqueada.');
            },
            video: (tagName, attribs) => {
                const nextAttribs = { ...attribs };
                if (attribs.src) {
                    const src = getTrustedPublicMediaUrl(attribs.src);
                    if (src) nextAttribs.src = src;
                    else delete nextAttribs.src;
                }
                if (attribs.poster) {
                    const poster = getTrustedPublicMediaUrl(attribs.poster);
                    if (poster) nextAttribs.poster = poster;
                    else delete nextAttribs.poster;
                }
                return { tagName, attribs: nextAttribs };
            },
            source: (tagName, attribs) => {
                const src = getTrustedPublicMediaUrl(attribs.src);
                return {
                    tagName,
                    attribs: src ? { ...attribs, src } : {},
                };
            },
            iframe: (_tagName, attribs): sanitizeHtml.Tag => {
                const videoId = getYoutubeVideoId(attribs.src);
                if (!videoId) return blockedResource('Contenido externo bloqueado.');

                if (requireYoutubeConsent) {
                    const label = 'Reproducir vídeo de YouTube. Al activarlo, tu navegador conectará con Google/YouTube y se aplicará su política de privacidad.';
                    return {
                        tagName: 'button',
                        attribs: {
                            type: 'button',
                            class: 'consent-rich-content__youtube-button',
                            'data-youtube-consent': 'true',
                            'data-youtube-id': videoId,
                            'aria-label': label,
                        },
                        text: label,
                    };
                }

                return {
                    tagName: 'iframe',
                    attribs: {
                        src: `https://www.youtube-nocookie.com/embed/${videoId}`,
                        title: 'Vídeo de YouTube',
                        width: attribs.width || '640',
                        height: attribs.height || '360',
                        loading: 'lazy',
                        referrerpolicy: 'strict-origin-when-cross-origin',
                        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                        allowfullscreen: '',
                        frameborder: '0',
                        class: 'consent-rich-content__youtube-frame',
                    },
                };
            },
        },
    };
}

/**
 * Clean rich text before it reaches a public page. The allow-list mirrors the
 * elements produced by the Tiptap editor while removing scripts, event
 * handlers, unsafe URL schemes and unrestricted inline CSS.
 */
export function sanitizeRichText(html: string) {
    return sanitizeHtml(html, getSanitizeOptions(false));
}

/**
 * Public rendering variant: YouTube iframes become inert, accessible buttons.
 * ConsentRichContent creates the privacy-enhanced iframe only after activation.
 */
export function sanitizePublicRichText(html: string) {
    return sanitizeHtml(html, getSanitizeOptions(true));
}
