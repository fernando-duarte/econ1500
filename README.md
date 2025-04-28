This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

- Node.js 22.0.0 or higher
- npm 10 or higher (comes with Node.js 22)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

This project follows the Next.js App Router architecture with the following directory structure:

- `app/`: Contains all the routes and app-specific components
- `components/`: Shared UI components used across multiple routes
- `lib/`: Business logic, data fetching, and API integrations
- `utils/`: Helper functions and utility modules
- `public/`: Static assets (images, fonts, etc.)
- `docs/`: Project documentation

### Directory Usage Guidelines

- **app/**: Route-specific components and layouts. Follow Next.js App Router conventions.
- **components/**: Reusable UI components (buttons, modals, forms, etc.)
- **lib/**: Code related to external services, data processing, and application logic
- **utils/**: Generic helper functions, formatters, validators, etc.

## Project Configuration and Standards

### Code Quality and Formatting

This project uses:

- **ESLint**: For code quality and style enforcement
- **Prettier**: For consistent code formatting
- **TypeScript**: For type checking
- **Husky**: For Git hooks to ensure code quality on commit
- **lint-staged**: For running linters on staged files

### Testing and Coverage

This project uses:

- **Playwright**: For end-to-end testing
- **Monocart Reporter**: For test coverage analysis

#### Running Tests with Coverage

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific tests with coverage
npm run test:coverage -- tests/your-test-file.spec.ts

# Run tests with UI mode
npm run test:coverage:ui
```

#### Viewing Coverage Reports

```bash
# View HTML coverage report in browser
npm run coverage:show
```

#### Cleaning Coverage Data

```bash
# Clean up coverage data and reports
npm run coverage:clean
```

#### Coverage Implementation Details

- Coverage is only collected in Chromium browsers (not Firefox or WebKit)
- Both JavaScript and CSS coverage are collected automatically
- Custom fixture in `tests/fixtures/coverage.ts` handles the coverage collection
- To use coverage in your tests, import from the fixtures:
  ```typescript
  import { test, expect } from "./fixtures/coverage";
  ```

### Configuration Files

- `eslint.config.mjs`: ESLint configuration
- `.prettierrc.json`: Prettier configuration
- `.gitignore`: Specifies files ignored by Git
- `.prettierignore`: Specifies files ignored by Prettier
- `.gitattributes`: Configures how Git handles different file types
- `.husky/`: Contains Git hooks for pre-commit checks

For more details on the ignore patterns and configuration, see the [Ignore Files Guide](./docs/ignore-files.md).

### Environment Variables

For setting up environment variables, refer to the [Environment Variables Template](./docs/env-template.md).
