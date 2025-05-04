/**
 * ESLint Configuration
 *
 * This file centralizes the ESLint configuration.
 * It exports a configuration object that matches the Next.js built-in linting rules
 * used by the pre-commit hook, but applies them to the entire codebase.
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Dependencies
      "node_modules",
      ".pnp",
      ".pnp.*",
      ".yarn/*",

      // Next.js build outputs
      ".next/",
      "out/",
      "build/",
      "dist/",

      // Cache and logs
      ".eslintcache",
      ".vercel",
      ".turbo",
      ".cache",
      ".swc/",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".pnpm-debug.log*",

      // Config files that don't need linting
      "next-env.d.ts",
      "next.config.js",
      "next.config.ts",
      "postcss.config.mjs",
      "tailwind.config.js",
      "tailwind.config.mjs",

      // Public folder and assets
      "public/",

      // Test coverage reports
      "coverage/",
      "test-results/",
      "playwright-report/",
      "monocart-report/assets/**",
      "monocart-report/coverage/**",

      // Editor-specific files
      ".idea/",
      ".vscode/",
      "*.swp",
      "*.swo",
      "*.suo",
      "*.ntvs*",
      "*.njsproj",
      "*.sln",

      // Miscellaneous
      ".DS_Store",
      "Thumbs.db",
      "*.pem",

      // Environment files
      ".env*",
      "!.env.example",
      "!.env.template",

      // Backup files
      "backups/",

      // Config directory (to avoid linting our own config files)
      "config/",
    ],
  },
  // Use the same configuration as in .eslintrc.json
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Keep the utility scripts exception
  {
    // Allow console.log in utility scripts
    files: ["**/validate-all-students.js", "**/scripts/**/*.js"],
    rules: {
      "no-console": "off",
    },
  },
];

export default eslintConfig;
