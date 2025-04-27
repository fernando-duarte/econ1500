import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Only run ESLint on the following directories during production builds
    // This can significantly improve build times for large projects
    dirs: ['app', 'components', 'lib', 'utils']
  },
  // Add image optimization settings
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Include optimized package imports to improve performance
  experimental: {
    // Optimize specific package imports
    optimizePackageImports: ['react-icons']
  },
  // Improve server response headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default nextConfig;
