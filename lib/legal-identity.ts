import 'server-only';

import { legalPublic } from '@/lib/legal-public';

function optionalValue(value: string | undefined) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}

export const legalIdentity = {
    ...legalPublic,
    taxId: optionalValue(process.env.LEGAL_TAX_ID),
    postalAddress: optionalValue(process.env.LEGAL_POSTAL_ADDRESS),
    registryDetails: optionalValue(process.env.LEGAL_REGISTRY_DETAILS),
} as const;

export const hasCompleteLegalIdentity = Boolean(
    legalIdentity.taxId && legalIdentity.postalAddress,
);

export const hasConfirmedProcessorCoverage = process.env.LEGAL_PROCESSOR_COVERAGE_CONFIRMED === 'true';

if (process.env.VERCEL_ENV === 'production' && (!hasCompleteLegalIdentity || !hasConfirmedProcessorCoverage)) {
    throw new Error(
        'Production legal configuration is incomplete: identity and processor coverage must be verified.',
    );
}
