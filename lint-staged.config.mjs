import { relative } from 'path';

// This configuration allows Next.js to lint only the changed files
// rather than running ESLint on the entire project on each commit
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(' --file ')}`;

export default {
  // Run ESLint on JS, JSX, TS, and TSX files
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  
  // Add Prettier formatting if you want to format other file types
  // '*.{json,md}': ['prettier --write']
}; 