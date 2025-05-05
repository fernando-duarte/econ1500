# ECON1500 Code Coverage Guide

This document explains how to work with the end-to-end test coverage setup in the ECON1500 project.

## Overview

Our coverage system uses:

- Playwright for running end-to-end tests
- V8 coverage for collecting coverage data
- Monocart-Reporter for processing and displaying coverage reports

## Complete Script Reference

### Linting and Code Quality

- `lint`: Run ESLint using Next.js configuration to identify code issues
- `lint:fix`: Run ESLint and automatically fix issues where possible
- `lint:all`: Lint the entire project and list all Playwright tests
- `lint:all:fix`: Lint and fix issues across the entire project
- `format`: Format code with Prettier according to project standards
- `type-check`: Run the TypeScript compiler without emitting files to check types

### Basic Testing

- `test:e2e`: Run Playwright end-to-end tests with list reporter for readable output
- `test:e2e:non-interactive`: Run tests and output JSON results for CI environments
- `test:auth-setup`: Set up authentication for Playwright tests
- `clean:test`: Remove test results and Playwright report directories
- `postinstall`: Automatically install Playwright dependencies after npm install

### Coverage Setup and Preparation

- `pretest:e2e:coverage`: Clean up and prepare directories for coverage collection - removes both `.v8-coverage` and `monocart-report` directories completely and recreates them fresh

### Single Test Coverage Options

- `test:e2e:coverage:single`: Run coverage on just the auth test (useful for quick checks)
- `test:e2e:coverage:single:safe`: Run auth test coverage with failure protection, allowing coverage processing even if tests fail

### Core Test Coverage Options

- `test:e2e:coverage:core`: Run coverage on critical test files only (auth, session management, form validation)

### Full Coverage Options

- `test:e2e:coverage`: Run coverage collection on all tests
- `test:e2e:coverage:nocss`: Run coverage excluding CSS files (significantly faster)
- `test:e2e:coverage:skip`: Run tests without collecting coverage (fastest option)
- `test:e2e:coverage:debug`: Run coverage with debug mode enabled for troubleshooting
- `test:e2e:coverage:bypass-thresholds`: Run coverage ignoring threshold requirements (for urgent fixes)
- `test:e2e:coverage:ci`: Run coverage optimized for CI environments with limited resources (increased memory, fewer workers)

### Coverage Reporting and Analysis

- `coverage:smoke`: Quick check that coverage hasn't regressed significantly
- `coverage:lcov`: Export coverage data to LCOV format for external tools
- `coverage:view`: Serve the coverage report on a local web server (port 8080)

### Combined Coverage and Viewing Commands

These commands run tests with coverage and automatically open the report viewer:

- `test:e2e:coverage:core:auto`: Run core tests coverage and view report
- `test:e2e:coverage:auto`: Run all tests coverage and view report
- `test:e2e:coverage:nocss:auto`: Run coverage without CSS and view report
- `test:e2e:coverage:single:auto`: Run single test coverage and view report
- `test:e2e:coverage:bypass-thresholds:auto`: Run coverage bypassing thresholds and view report
- `test:e2e:coverage:ci:auto`: Run CI-optimized coverage and view report

## Running Tests with Coverage

To run tests with coverage:

```bash
# Run all tests with full coverage
npm run test:e2e:coverage

# Run without CSS coverage (faster)
npm run test:e2e:coverage:nocss

# Skip coverage entirely (fastest)
npm run test:e2e:coverage:skip
```

## Coverage Thresholds

We enforce the following minimum coverage thresholds:

- **Global**:

  - Lines: 60%
  - Functions: 50%
  - Branches: 40%
  - Statements: 60%

- **Critical paths**:
  - **lib/auth**:
    - Lines: 80%
    - Functions: 70%
    - Branches: 60%
    - Statements: 80%
  - **lib/socket**:
    - Lines: 75%
    - Functions: 70%
    - Branches: 50%
    - Statements: 75%

## Viewing Coverage Reports

After running tests with coverage:

1. Open `./monocart-report/index.html` in your browser
2. Or run `npm run coverage:view` to start a local server at http://localhost:8080

The coverage report provides:

- Overall coverage metrics
- Per-file coverage details
- Highlighted source code showing covered/uncovered lines
- Function coverage statistics

## Working with Coverage in CI

Our CI pipeline:

1. Runs tests with coverage (`test:e2e:coverage:ci`)
2. Uploads reports as artifacts
3. Integrates with Coveralls for tracking coverage over time

You can view the latest coverage reports by downloading the artifacts from the GitHub Actions workflow.

## Making Urgent Fixes

If you need to make an urgent fix and can't meet coverage thresholds:

```bash
# Bypass threshold checks
npm run test:e2e:coverage:bypass-thresholds
```

**Important**: This should be used only for urgent fixes. You should add tests to improve coverage as soon as possible.

## Troubleshooting

If you encounter issues with coverage:

1. Check for errors in the console
2. Try running with debugging: `npm run test:e2e:coverage:debug`
3. Check if your files are being excluded by filters in the Playwright configuration
4. For large test suites, use `npm run test:e2e:coverage:ci` with its increased memory allocation

## Coverage Maintenance

To maintain good coverage:

1. Always write tests for new features
2. Use the smoke check to detect regressions: `npm run coverage:smoke`
3. Review coverage reports after making significant changes
4. Gradually improve coverage over time

## Common Commands

```bash
# Run core tests with coverage (faster than full suite)
npm run test:e2e:coverage:core

# Run tests and automatically view report
npm run test:e2e:coverage:auto

# Check if coverage has regressed
npm run coverage:smoke

# Export coverage to LCOV format (for CI tools)
npm run coverage:lcov
```

## Best Practices

1. **Write tests as you code**: Don't wait until after implementing a feature to write tests.
2. **Focus on critical paths**: Prioritize coverage for auth, socket, and other core features.
3. **Review uncovered lines**: Look at the report to understand which logic paths aren't being tested.
4. **Test error handling**: Error states are often missed in testing but critical for robust applications.

## Support

If you have questions about the coverage setup or need help improving coverage for your components, please contact the DevOps team.
