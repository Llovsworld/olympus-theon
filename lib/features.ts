import 'server-only';

import { legalPagesEnabled } from '@/lib/legal-identity';

const hasEmailDelivery = Boolean(
    process.env.RESEND_API_KEY
    && process.env.EMAIL_FROM
    && process.env.CONTACT_EMAIL,
);
const hasNewsletterTokens = Boolean(process.env.NEWSLETTER_TOKEN_SECRET);

export const featureFlags = {
    contactForm: process.env.CONTACT_FORM_ENABLED === 'true' && hasEmailDelivery && legalPagesEnabled,
    newsletter: process.env.NEWSLETTER_ENABLED === 'true'
        && hasEmailDelivery
        && hasNewsletterTokens
        && legalPagesEnabled,
} as const;
