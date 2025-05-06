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
- `config/`: Centralized configuration files
- `lib/`: Business logic, data fetching, and API integrations
- `utils/`: Helper functions and utility modules
- `public/`: Static assets (images, fonts, etc.)
- `docs/`: Project documentation

### Directory Usage Guidelines

- **app/**: Route-specific components and layouts. Follow Next.js App Router conventions.
- **components/**: Reusable UI components (buttons, modals, forms, etc.)
- **config/**: Centralized configuration for tools like ESLint, Prettier, and lint-staged
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

### Configuration System

The project uses a centralized configuration approach:

- **`config/`**: Contains all tool configurations
  - `eslint.js`: ESLint rules and settings
  - `prettier.js`: Prettier formatting options
  - `lint-staged.js`: Pre-commit linting configuration
  - `README.md`: Documentation for the configuration system

Scripts in `package.json` reference these configurations.

> **Note:** For backward compatibility, some original configuration files are still present but will be deprecated in future updates.

### Testing

This project uses:

- **Playwright**: For end-to-end testing

#### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run a specific test file
npm run test:e2e tests/e2e/auth.spec.ts

# Generate authentication test file
npm run test:auth-generate

# Set up authentication with browser session
npm run test:auth-setup
```

#### Test Suite Overview

The test suite includes end-to-end tests for validating application functionality including authentication, form validation, and user interactions.

#### Test Artifacts and Coverage

This project follows these best practices for test artifacts:

- **Committed to version control**:

  - Test code and configuration files
  - CI/CD workflow definitions
  - Coverage threshold configurations

- **Generated locally, not committed**:
  - Test results and screenshots (`/test-results/`)
  - Coverage reports (`/monocart-report/`, `.v8-coverage/`)
  - Authentication state files (generated at runtime)
  - HTML reports and LCOV files

The `.gitignore` file is configured to exclude generated test artifacts while keeping essential test configuration.

#### Authentication for Tests

For tests requiring authentication:

- Use `npm run test:auth-generate` to create authentication state files
- In CI environments, authentication files are generated during test setup
- Use environment variable `TEST_USERNAME` to customize the test user

### Environment Variables

For setting up environment variables, refer to the [Environment Variables Template](./docs/env-template.md).
