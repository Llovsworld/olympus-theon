import sanitizeHtml from 'sanitize-html';

const allowedTags = [
    ...sanitizeHtml.defaults.allowedTags,
    'div',
    'figure',
    'figcaption',
    'img',
    'iframe',
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

/**
 * Clean rich text before it reaches a public page. The allow-list mirrors the
 * elements produced by the Tiptap editor while removing scripts, event
 * handlers, unsafe URL schemes and unrestricted inline CSS.
 */
export function sanitizeRichText(html: string) {
    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            '*': ['class', 'style'],
            a: ['href', 'name', 'target', 'rel', 'title'],
            div: ['class', 'style', 'data-youtube-video'],
            img: ['src', 'alt', 'title', 'width', 'height', 'style', 'class', 'data-align'],
            iframe: ['src', 'title', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'class'],
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
        },
    });
}
