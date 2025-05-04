# Configuration Directory

This directory centralizes configuration files for the project's tooling. The goal is to make configuration more maintainable by keeping related settings together and well-documented.

## Configuration Files

- **`eslint.js`**: Contains ESLint rules for code linting
- **`prettier.js`**: Contains Prettier configuration for code formatting
- **`lint-staged.js`**: Defines what commands run on staged files during git commits

## Usage

These configuration files are imported by their respective tools through references in `package.json`. The project is set up so that you can:

1. **Run linting**: `npm run lint` or `npm run lint:all`
2. **Format code**: `npm run format`
3. **Automatically lint/format on commit**: Uses `lint-staged` with Husky

## Extending Configurations

### ESLint

To extend the ESLint configuration, edit `eslint.js`. The configuration is exported as an array of objects, with each object representing a set of rules or overrides.

### Prettier

To extend the Prettier configuration, edit `prettier.js`. The configuration is exported as a simple object.

### Lint-Staged

To change what happens during git commits, edit `lint-staged.js`.

## Notes for Developers

- The `.prettierignore` file is kept at the root level for compatibility reasons
- When adding new rules, include comments explaining their purpose and why certain values were chosen
- Keep configurations focused on their specific tool - don't mix concerns
