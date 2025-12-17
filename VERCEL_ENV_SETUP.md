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
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

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
2. Select your project "olympus-theon"
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. **Important**: Set them for all environments (Production, Preview, Development)
6. Redeploy: Go to **Deployments** → click the 3 dots on latest → **Redeploy**

## Troubleshooting

- **404 on /admin**: Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- **Database errors**: Missing `POSTGRES_PRISMA_URL`
- **Login fails**: Missing `ADMIN_USERNAME` or `ADMIN_PASSWORD`
