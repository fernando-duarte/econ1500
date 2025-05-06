# ECON1500 Package Documentation

## Project Information

- **Name**: econ1500 - Economic course project
- **Version**: 0.1.0 (Initial development version)
- **Private**: Not published to npm
- **Type**: Uses ES modules
- **Node Requirement**: Requires Node.js version 22 or higher

## Scripts Reference

### Basic Next.js Development Commands

- `dev`: Start development server with Turbopack for faster builds
- `build`: Build for production
- `start`: Start production server

### Code Quality & Linting

- `lint`: Run ESLint using Next.js configuration
- `lint:fix`: Run ESLint and auto-fix issues
- `lint:all`: Lint entire project and list Playwright tests
- `lint:all:fix`: Lint and fix entire project
- `prepare`: Set up Git hooks with Husky
- `format`: Format code with Prettier
- `type-check`: Check TypeScript types without generating files

### Build Analysis

- `analyze`: Build with bundle analysis enabled

### End-to-End Testing

- `test:e2e`: Run Playwright tests with list output
- `test:e2e:non-interactive`: Run tests for CI environments
- `test:auth-setup`: Set up authentication for testing
- `clean:test`: Clean test results
- `postinstall`: Install Playwright after npm install

### Coverage Setup

- `pretest:e2e:coverage`: Clean up and prepare coverage directories - removes both `.v8-coverage` and `monocart-report` directories and recreates them

### Single Test Coverage Options

- `test:e2e:coverage:single`: Run coverage on auth test
- `test:e2e:coverage:single:safe`: Run auth test coverage with failure protection

### Core Tests Coverage

- `test:e2e:coverage:core`: Run coverage on critical tests (auth, session management, form validation)

### Full Coverage Options

- `test:e2e:coverage`: Run coverage on all tests
- `test:e2e:coverage:nocss`: Run coverage excluding CSS
- `test:e2e:coverage:skip`: Run tests without coverage
- `test:e2e:coverage:debug`: Debug coverage collection
- `test:e2e:coverage:bypass-thresholds`: Run coverage ignoring threshold requirements
- `test:e2e:coverage:ci`: Run coverage optimized for CI environments (limited memory, fewer workers)

### Coverage Reporting

- `coverage:smoke`: Quick check that coverage hasn't regressed
- `coverage:lcov`: Export LCOV format for external tools
- `coverage:view`: View coverage report in browser

### Combined Coverage and Viewing Commands

- `test:e2e:coverage:core:auto`: Run core tests and open coverage report
- `test:e2e:coverage:auto`: Run all tests and open coverage report
- `test:e2e:coverage:nocss:auto`: Run coverage without CSS and open report
- `test:e2e:coverage:single:auto`: Run single test coverage and open report
- `test:e2e:coverage:bypass-thresholds:auto`: Bypass thresholds and view report
- `test:e2e:coverage:ci:auto`: Run CI coverage and open report

## Pre-Commit Hooks (lint-staged)

- **JavaScript/TypeScript Files**: Lint, format, and type-check
- **JSON/Markdown/CSS Files**: Format with Prettier

## Dependencies

### Production Dependencies

- `@hookform/resolvers`: Form validation resolvers
- `@radix-ui/react-dialog`: Accessible dialog component
- `@radix-ui/react-label`: Accessible label component
- `@radix-ui/react-navigation-menu`: Accessible navigation component
- `@radix-ui/react-popover`: Accessible popover component
- `@radix-ui/react-slot`: Slot pattern for React
- `@tailwindcss/forms`: Form styles for Tailwind CSS
- `@tailwindcss/typography`: Typography styles for Tailwind CSS
- `@tanstack/react-query`: Data fetching and caching
- `class-variance-authority`: Utility for creating variants
- `clsx`: Class name utilities
- `cmdk`: Command menu component
- `lucide-react`: Icon library
- `next`: Next.js framework
- `next-themes`: Theme handling for Next.js
- `react`: React library
- `react-dom`: React DOM bindings
- `react-hook-form`: Form handling library
- `socket.io`: WebSocket server
- `socket.io-client`: WebSocket client
- `sonner`: Toast notifications
- `tailwind-merge`: Utility for merging Tailwind classes
- `zod`: Schema validation library

### Development Dependencies

- `@babel/plugin-proposal-class-properties`: Babel plugin for class properties
- `@babel/plugin-proposal-decorators`: Babel plugin for decorators
- `@babel/plugin-transform-runtime`: Babel plugin for runtime transformation
- `@babel/preset-env`: Babel preset for environment targeting
- `@babel/preset-typescript`: Babel preset for TypeScript
- `@babel/runtime`: Babel runtime helpers
- `@eslint/eslintrc`: ESLint configuration
- `@playwright/test`: End-to-end testing framework
- `@shadcn/ui`: UI component collection
- `@tailwindcss/aspect-ratio`: Aspect ratio utilities
- `@tailwindcss/postcss`: PostCSS plugin for Tailwind
- `@tsconfig/next`: TypeScript configuration for Next.js
- `@types/node`: TypeScript definitions for Node.js
- `@types/react`: TypeScript definitions for React
- `@types/react-dom`: TypeScript definitions for React DOM
- `autoprefixer`: PostCSS plugin for vendor prefixes
- `cross-env`: Cross-platform environment variables
- `eslint`: Linting utility
- `eslint-config-next`: ESLint configuration for Next.js
- `eslint-config-prettier`: ESLint configuration for Prettier
- `http-server`: Simple HTTP server
- `husky`: Git hooks management
- `lint-staged`: Run linters on staged files
- `monocart-reporter`: Test coverage reporter
- `p-limit`: Limit concurrent operations
- `prettier`: Code formatter
- `prettier-plugin-tailwindcss`: Tailwind CSS plugin for Prettier
- `rimraf`: Cross-platform rm -rf
- `tailwindcss`: CSS framework
- `ts-node`: TypeScript execution environment for Node.js
- `tw-animate-css`: Animation utilities for Tailwind
- `typescript`: TypeScript language
- `v8-to-istanbul`: Convert V8 coverage to Istanbul format
