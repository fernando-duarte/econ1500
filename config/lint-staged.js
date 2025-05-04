/**
 * Lint-Staged Configuration
 *
 * This file centralizes the lint-staged configuration.
 * It controls which linting and formatting commands run on files
 * that are staged for commit.
 */

import { relative } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

// This configuration allows Next.js to lint only the changed files
// rather than running ESLint on the entire project on each commit
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => relative(rootDir, f)).join(" --file ")}`;

const config = {
  // Run ESLint on JS, JSX, TS, and TSX files
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],

  // Add Prettier formatting for other file types
  "*.{json,md,css}": ["prettier --write"],
};

export default config;
