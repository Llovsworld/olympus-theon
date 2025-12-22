import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'en'
});

// Export as proxy function for Next.js 16
export function proxy(request: NextRequest) {
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames, exclude admin and API routes
    matcher: ['/', '/(es|en)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)']
};

