import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Only run ESLint on the following directories during production builds
    // This can significantly improve build times for large projects
    dirs: ['app', 'components', 'lib', 'utils']
  }
};

export default nextConfig;
