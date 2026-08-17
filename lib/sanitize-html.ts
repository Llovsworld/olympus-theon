import { parseDocument } from 'htmlparser2';
import { hasChildren, isTag, isText, type AnyNode, type Element } from 'domhandler';

const ALLOWED_TAGS = new Set([
    'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'small',
    'blockquote', 'pre', 'code', 'ul', 'ol', 'li',
    'a', 'img', 'div', 'span',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'iframe',
]);

const DROP_WITH_CONTENT = new Set([
    'script', 'style', 'noscript', 'template', 'svg', 'math', 'object', 'embed',
    'form', 'input', 'button', 'textarea', 'select', 'option', 'meta', 'link', 'base',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img']);
const SAFE_CLASS = /^(?:language-[a-z0-9_-]+|content-image|video-wrapper)$/i;
const SAFE_DIMENSION = /^(?:[1-9]\d{0,3}|10000)$/;
const SAFE_CSS_LENGTH = /^(?:0|auto|\d{1,4}(?:\.\d+)?(?:px|%|rem|em))$/i;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function escapeHtmlText(value: string): string {
    return escapeHtml(value);
}

function safeWebUrl(value: string, options: { image?: boolean } = {}): string | null {
    const candidate = value.trim();
    if (!candidate || candidate.length > 2048 || /[\u0000-\u001F\u007F\\]/.test(candidate)) {
        return null;
    }

    if (/^\/(?!\/)/.test(candidate) || (!options.image && /^(?:#|\?)/.test(candidate))) {
        return candidate;
    }

    try {
        const url = new URL(candidate);
        if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
        if (!options.image && (url.protocol === 'mailto:' || url.protocol === 'tel:')) {
            return candidate;
        }
    } catch {
        return null;
    }

    return null;
}

function safeYoutubeEmbed(value: string): string | null {
    const safeUrl = safeWebUrl(value);
    if (!safeUrl) return null;

    try {
        const url = new URL(safeUrl);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
        if (!['youtube.com', 'youtube-nocookie.com'].includes(hostname)) return null;
        if (!url.pathname.startsWith('/embed/')) return null;
        return url.toString();
    } catch {
        return null;
    }
}

function sanitizeClass(value: string): string | null {
    const classes = value.split(/\s+/).filter((item) => SAFE_CLASS.test(item));
    return classes.length > 0 ? classes.join(' ') : null;
}

function sanitizeStyle(value: string, tag: string): string | null {
    const allowed: string[] = [];

    for (const declaration of value.split(';')) {
        const separator = declaration.indexOf(':');
        if (separator === -1) continue;

        const property = declaration.slice(0, separator).trim().toLowerCase();
        const rawValue = declaration.slice(separator + 1).trim().toLowerCase();
        if (!rawValue || /[()\\]/.test(rawValue)) continue;

        if (property === 'text-align' && ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(tag)) {
            if (['left', 'center', 'right', 'justify'].includes(rawValue)) {
                allowed.push(`${property}:${rawValue}`);
            }
            continue;
        }

        if (tag !== 'img') continue;

        if (['width', 'height', 'max-width', 'max-height', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'].includes(property)) {
            if (SAFE_CSS_LENGTH.test(rawValue)) allowed.push(`${property}:${rawValue}`);
            continue;
        }

        if (property === 'margin') {
            const parts = rawValue.split(/\s+/);
            if (parts.length <= 4 && parts.every((part) => SAFE_CSS_LENGTH.test(part))) {
                allowed.push(`${property}:${parts.join(' ')}`);
            }
            continue;
        }

        if (property === 'display' && ['block', 'inline', 'inline-block'].includes(rawValue)) {
            allowed.push(`${property}:${rawValue}`);
        } else if (property === 'float' && ['left', 'right', 'none'].includes(rawValue)) {
            allowed.push(`${property}:${rawValue}`);
        } else if (property === 'object-fit' && ['contain', 'cover', 'fill', 'scale-down'].includes(rawValue)) {
            allowed.push(`${property}:${rawValue}`);
        }
    }

    return allowed.length > 0 ? `${allowed.join(';')};` : null;
}

function addAttribute(output: Record<string, string>, name: string, value: string | null): void {
    if (value !== null && value !== '') output[name] = value;
}

function sanitizeAttributes(node: Element, tag: string): Record<string, string> | null {
    const input = node.attribs;
    const output: Record<string, string> = {};

    if (input.class) addAttribute(output, 'class', sanitizeClass(input.class));
    if (input.style) addAttribute(output, 'style', sanitizeStyle(input.style, tag));

    if (tag === 'a') {
        const href = input.href ? safeWebUrl(input.href) : null;
        if (!href) return null;
        output.href = href;
        if (input.title) output.title = input.title.slice(0, 300);
        if (input.target === '_blank') {
            output.target = '_blank';
            output.rel = 'noopener noreferrer';
        }
    }

    if (tag === 'img') {
        const src = input.src ? safeWebUrl(input.src, { image: true }) : null;
        if (!src) return null;
        output.src = src;
        output.alt = (input.alt || '').slice(0, 500);
        if (input.title) output.title = input.title.slice(0, 300);
        if (input.width && SAFE_DIMENSION.test(input.width)) output.width = input.width;
        if (input.height && SAFE_DIMENSION.test(input.height)) output.height = input.height;
        if (['left', 'center', 'right'].includes(input['data-align'])) {
            output['data-align'] = input['data-align'];
        }
        output.loading = 'lazy';
        output.decoding = 'async';
    }

    if (tag === 'iframe') {
        const src = input.src ? safeYoutubeEmbed(input.src) : null;
        if (!src) return null;
        output.src = src;
        output.title = (input.title || 'YouTube video').slice(0, 300);
        if (input.width && SAFE_DIMENSION.test(input.width)) output.width = input.width;
        if (input.height && SAFE_DIMENSION.test(input.height)) output.height = input.height;
        output.loading = 'lazy';
        output.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        output.allowfullscreen = '';
        output.referrerpolicy = 'strict-origin-when-cross-origin';
    }

    if (tag === 'div' && Object.prototype.hasOwnProperty.call(input, 'data-youtube-video')) {
        output['data-youtube-video'] = '';
    }

    if (tag === 'ol' && input.start && /^-?\d{1,5}$/.test(input.start)) output.start = input.start;
    if (['th', 'td'].includes(tag)) {
        if (input.colspan && /^\d{1,2}$/.test(input.colspan)) output.colspan = input.colspan;
        if (input.rowspan && /^\d{1,2}$/.test(input.rowspan)) output.rowspan = input.rowspan;
    }
    if (tag === 'th' && ['row', 'col', 'rowgroup', 'colgroup'].includes(input.scope)) {
        output.scope = input.scope;
    }

    return output;
}

function renderChildren(node: AnyNode): string {
    if (!hasChildren(node)) return '';
    return node.children.map(renderNode).join('');
}

function renderNode(node: AnyNode): string {
    if (isText(node)) return escapeHtml(node.data);
    if (!isTag(node)) return hasChildren(node) ? renderChildren(node) : '';

    const tag = node.name.toLowerCase();
    if (DROP_WITH_CONTENT.has(tag)) return '';
    if (!ALLOWED_TAGS.has(tag)) return renderChildren(node);

    const attributes = sanitizeAttributes(node, tag);
    if (attributes === null) {
        return tag === 'a' ? renderChildren(node) : '';
    }

    const serializedAttributes = Object.entries(attributes)
        .map(([name, value]) => value === '' ? ` ${name}` : ` ${name}="${escapeHtml(value)}"`)
        .join('');

    if (VOID_TAGS.has(tag)) return `<${tag}${serializedAttributes}>`;
    return `<${tag}${serializedAttributes}>${renderChildren(node)}</${tag}>`;
}

export function sanitizeRichHtml(html: string): string {
    if (!html) return '';
    const document = parseDocument(html, { decodeEntities: true });
    return document.children.map(renderNode).join('');
}
