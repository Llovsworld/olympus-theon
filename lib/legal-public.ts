import { AUTHOR_NAME, SITE_NAME, SITE_URL } from '@/lib/seo';

export const LEGAL_POLICY_VERSION = '2026-09-02';
export const LEGAL_LAST_UPDATED = '2 de septiembre de 2026';

export const legalPublic = {
    brandName: SITE_NAME,
    responsibleName: AUTHOR_NAME,
    siteUrl: SITE_URL,
    email: 'Olympustheon@gmail.com',
    phoneDisplay: '+34 608 961 701',
    phoneHref: '+34608961701',
} as const;
