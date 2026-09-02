# Vercel Environment Variables Setup

## Required Environment Variables

Copy these to Vercel Dashboard → Settings → Environment Variables:

### Database (Vercel Postgres)
```
POSTGRES_PRISMA_URL=your_postgres_url_here
POSTGRES_URL_NON_POOLING=your_direct_url_here
```

### Authentication (NextAuth)
```
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://www.olympustheon.com
```

### Public URL and transactional email
```
NEXT_PUBLIC_APP_URL=https://www.olympustheon.com
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Olympus Theon <hola@olympustheon.com>
CONTACT_EMAIL=your_real_contact_email
NEWSLETTER_TOKEN_SECRET=generate_a_long_random_secret
CONTACT_FORM_ENABLED=false
NEWSLETTER_ENABLED=false
```

`EMAIL_FROM` must use a sender domain verified in Resend. `NEWSLETTER_TOKEN_SECRET`
can fall back to `NEXTAUTH_SECRET`, but using a separate random value is recommended.

### Verified legal identity
```
LEGAL_TAX_ID=your_real_nif_or_cif
LEGAL_POSTAL_ADDRESS=your_real_professional_postal_address
LEGAL_REGISTRY_DETAILS=only_if_applicable
LEGAL_PROCESSOR_COVERAGE_CONFIRMED=false_until_contracts_are_verified
LEGAL_PAGES_ENABLED=false
```

Never deploy the legal pages as final with placeholder or invented identity data.
Set `LEGAL_PROCESSOR_COVERAGE_CONFIRMED=true` only after confirming that the
hosting/database/email processor agreements cover the production setup.

Keep the three feature switches set to `false` while their setup is pending.
Enable `CONTACT_FORM_ENABLED` and `NEWSLETTER_ENABLED` only after testing Resend.
Enable `LEGAL_PAGES_ENABLED` only after adding the real identity details and
confirming processor coverage.

### Admin Credentials
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

### Blob Storage (if using)
```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## How to Set Up

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select the production project `olympus-theon-17nl`
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. **Important**: Set them for all environments (Production, Preview, Development)
6. Redeploy: Go to **Deployments** → click the 3 dots on latest → **Redeploy**

## Troubleshooting

- **404 on /admin**: Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- **Database errors**: Missing `POSTGRES_PRISMA_URL`
- **Login fails**: Missing `ADMIN_USERNAME` or `ADMIN_PASSWORD`
