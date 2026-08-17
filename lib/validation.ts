export class RequestValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RequestValidationError';
    }
}

export type JsonObject = Record<string, unknown>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function readJsonObject(request: Request): Promise<JsonObject> {
    let value: unknown;

    try {
        value = await request.json();
    } catch {
        throw new RequestValidationError('Invalid JSON body');
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new RequestValidationError('Request body must be a JSON object');
    }

    return value as JsonObject;
}

export function readString(
    body: JsonObject,
    field: string,
    options: {
        maxLength: number;
        required?: boolean;
        allowEmpty?: boolean;
        trim?: boolean;
    }
): string | null {
    const value = body[field];
    const required = options.required ?? false;
    const trim = options.trim ?? true;

    if (value === undefined || value === null) {
        if (required) {
            throw new RequestValidationError(`${field} is required`);
        }
        return null;
    }

    if (typeof value !== 'string') {
        throw new RequestValidationError(`${field} must be a string`);
    }

    const normalized = trim ? value.trim() : value;
    if (!options.allowEmpty && normalized.trim().length === 0) {
        if (required) {
            throw new RequestValidationError(`${field} is required`);
        }
        return null;
    }

    if (normalized.length > options.maxLength) {
        throw new RequestValidationError(`${field} is too long`);
    }

    return normalized;
}

export function readBoolean(
    body: JsonObject,
    field: string,
    fallback: boolean
): boolean {
    const value = body[field];
    if (value === undefined) return fallback;
    if (typeof value !== 'boolean') {
        throw new RequestValidationError(`${field} must be a boolean`);
    }
    return value;
}

export function normalizeEmail(value: unknown): string {
    if (typeof value !== 'string') {
        throw new RequestValidationError('Invalid email address');
    }

    const email = value.trim().normalize('NFKC').toLowerCase();
    if (email.length === 0 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
        throw new RequestValidationError('Invalid email address');
    }

    return email;
}

export function normalizeSlug(value: unknown): string {
    if (typeof value !== 'string') {
        throw new RequestValidationError('slug is required');
    }

    const slug = value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!slug || slug.length > 120) {
        throw new RequestValidationError('Invalid slug');
    }

    return slug;
}

export function getSafeHttpUrl(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const candidate = value.trim();
    if (!candidate || candidate.length > 2048 || /[\u0000-\u001F\u007F]/.test(candidate)) {
        return null;
    }

    try {
        const url = new URL(candidate);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
    } catch {
        return null;
    }
}

export function normalizeOptionalHttpUrl(value: unknown, field: string): string | null {
    if (value === undefined || value === null || value === '') return null;
    const url = getSafeHttpUrl(value);
    if (!url) {
        throw new RequestValidationError(`${field} must be a valid HTTP(S) URL`);
    }
    return url;
}

export function normalizeOptionalImageUrl(value: unknown, field: string): string | null {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value !== 'string') {
        throw new RequestValidationError(`${field} must be a valid image URL`);
    }

    const candidate = value.trim();
    if (/^\/(?!\/)/.test(candidate) && !/[\u0000-\u001F\u007F\\]/.test(candidate)) {
        return candidate;
    }

    const url = getSafeHttpUrl(candidate);
    if (!url) {
        throw new RequestValidationError(`${field} must be a valid image URL`);
    }
    return url;
}

const MAX_PAGE_SIZE = 100;
const MAX_DATABASE_OFFSET = 2_147_483_647;

function parseIntegerParameter(
    rawValue: string | null,
    field: string,
    options: { defaultValue: number; allowZero?: boolean }
): number {
    if (rawValue === null) return options.defaultValue;

    const pattern = options.allowZero ? /^\d+$/ : /^[1-9]\d*$/;
    if (!pattern.test(rawValue)) {
        throw new RequestValidationError(`${field} must be a valid integer`);
    }

    const value = Number(rawValue);
    if (!Number.isSafeInteger(value)) {
        throw new RequestValidationError(`${field} is too large`);
    }
    return value;
}

export function parsePagination(searchParams: URLSearchParams): { take: number; skip: number } {
    const requestedLimit = parseIntegerParameter(searchParams.get('limit'), 'limit', {
        defaultValue: MAX_PAGE_SIZE,
    });
    const take = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const rawOffset = searchParams.get('offset');
    const rawPage = searchParams.get('page');

    if (rawOffset !== null && rawPage !== null) {
        throw new RequestValidationError('Use either page or offset, not both');
    }

    const skip = rawOffset !== null
        ? parseIntegerParameter(rawOffset, 'offset', { defaultValue: 0, allowZero: true })
        : (parseIntegerParameter(rawPage, 'page', { defaultValue: 1 }) - 1) * take;

    if (!Number.isSafeInteger(skip) || skip > MAX_DATABASE_OFFSET) {
        throw new RequestValidationError('Pagination offset is too large');
    }

    return { take, skip };
}
