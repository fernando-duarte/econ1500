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
  },
  // Include optimized package imports to improve performance
  experimental: {
    // Optimize specific package imports
    optimizePackageImports: ["react-icons"],
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
      ],
    },
  ],
  // Configure webpack for full source maps in development
  webpack: (config, { dev }) => {
    // Enable full source maps for development mode
    if (dev) {
      config.devtool = 'source-map';
    }
    return config;
  },
  // Turbopack configuration to mirror webpack settings
  turbopack: {
    // Default resolve extensions to ensure module resolution works correctly
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
  },
};

export default nextConfig;
