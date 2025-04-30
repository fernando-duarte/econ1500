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
      "backups/"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      // Common rules you might want to customize
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],

      // Additional recommended rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Not needed with TypeScript
      "prefer-const": "error", // Enforce const for variables that don't change
      "no-console": ["warn", { "allow": ["warn", "error"] }], // Warn about console.log in production
      "jsx-a11y/alt-text": "error", // Enforce alt text for accessibility
      "no-duplicate-imports": "error", // Prevent duplicate imports
      "no-var": "error", // Prevent use of var

      // Global max-lines rule as a baseline
      "max-lines": ["warn", {
        "max": 200,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  },
  // Specific overrides for different file types
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      // Components can be up to 200 lines
      "max-lines": ["warn", {
        "max": 200,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  },
  {
    files: ["**/*.ts", "**/*.js"],
    rules: {
      // Utility files should be more concise (150 lines)
      "max-lines": ["warn", {
        "max": 150,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  },
  {
    files: ["**/test/**", "**/*.test.*", "**/*.spec.*"],
    rules: {
      // Test files can be longer (300 lines)
      "max-lines": ["warn", {
        "max": 300,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  },
  {
    files: ["**/page.tsx", "**/layout.tsx"],
    rules: {
      // Next.js page/layout components can be a bit longer (250 lines)
      "max-lines": ["warn", {
        "max": 250,
        "skipBlankLines": true,
        "skipComments": true
      }]
    }
  }
];

export default eslintConfig;
