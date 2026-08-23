import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames, excluding admin and API routes.
    matcher: ['/', '/(es|en)/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)+']
};
