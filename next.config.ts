import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Only run ESLint on the following directories during production builds
    // This can significantly improve build times for large projects
    dirs: ["app", "components", "lib", "utils"],
  },
  // Add image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
    // Define device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Define image sizes for the Image component's sizes prop
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Include optimized package imports to improve performance
  experimental: {
    // Optimize specific package imports
    optimizePackageImports: ["react-icons"],
  },
  // Turbopack configuration (moved from experimental to top-level in Next.js 15.3+)
  turbopack: {
    // Default resolve extensions to ensure module resolution works correctly
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".css"],
  },
  // Improve server response headers
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*; frame-ancestors 'none';",
        },
      ],
    },
  ],
  // Configure webpack for full source maps in development
  webpack: (config, { dev }) => {
    // Enable full source maps for development mode
    if (dev) {
      config.devtool = "source-map";
    }
    return config;
  },
  // Improve performance with compression
  compress: true,
  // Power development tooling
  reactStrictMode: true,
  // Improved error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
};

export default nextConfig;
