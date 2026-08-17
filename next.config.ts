import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
    ],
  },

  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', '@tiptap/react', '@tiptap/starter-kit'],
  },

};

export default withNextIntl(nextConfig);
