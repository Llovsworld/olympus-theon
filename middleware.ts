import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames, exclude admin and API routes
    matcher: ['/', '/(es|en)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)+']
};
