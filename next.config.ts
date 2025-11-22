import type { NextConfig } from "next";

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,

  // Configure custom cache handler for Vercel ISR
  cacheHandler: process.env.NODE_ENV === 'production' 
    ? require.resolve('./cache-handler.mjs')
    : undefined,
  
  // Disable default in-memory caching when using custom handler
  cacheMaxMemorySize: process.env.NODE_ENV === 'production' ? 0 : 50 * 1024 * 1024,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  compress: true,

  webpack: (config) => {
    return config;
  },
};

export default withNextIntl(nextConfig);
