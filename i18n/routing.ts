import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localePrefix: 'as-needed',
    // English routes still reuse Spanish content. Keep crawlers and language
    // detection from creating duplicate localized URLs until translations exist.
    localeDetection: false,
    localeCookie: false,
    alternateLinks: false,
});
