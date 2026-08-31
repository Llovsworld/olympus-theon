import sanitizeHtml from 'sanitize-html';

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
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowProtocolRelative: false,
        allowedSchemesByTag: {
            img: ['http', 'https'],
            iframe: ['https'],
            video: ['http', 'https'],
            source: ['http', 'https'],
        },
        allowedIframeHostnames: [
            'www.youtube.com',
            'youtube.com',
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

/** Clean rich text when it is stored or used outside a public visitor page. */
export function sanitizeRichText(html: string) {
    return sanitizeHtml(html, getSanitizeOptions(false));
}

/** Replace YouTube embeds with an inert control until the visitor activates one. */
export function sanitizePublicRichText(html: string) {
    return sanitizeHtml(html, getSanitizeOptions(true));
}
