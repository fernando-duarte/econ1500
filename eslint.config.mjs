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
      ".pnp.js",

      // Next.js build outputs
      ".next/",
      "out/",
      "build/",
      "dist/",

      // Cache and logs
      ".eslintcache",
      ".vercel",
      ".turbo",
      "*.log",

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
      ".nyc_output/",

      // Editor-specific files
      ".idea/",
      ".vscode/",
      "*.swp",
      "*.swo",

      // Miscellaneous
      ".DS_Store",
      "*.pem",
      ".env*",
      "!.env.example"
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
      "no-var": "error" // Prevent use of var
    }
  }
];

export default eslintConfig;
