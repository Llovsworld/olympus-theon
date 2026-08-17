import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function proxy(request: NextRequest) {
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/es/:path*', '/((?!api|admin|_next|_vercel|.*\\..*).*)+'],
};
