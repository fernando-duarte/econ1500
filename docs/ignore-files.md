# Project Ignore Files Guide

This document explains the various ignore files used in this project and the rationale behind them.

## Overview

The project uses several ignore files to prevent unnecessary files from being tracked, linted, or formatted:

- `.gitignore` - Prevents files from being tracked by Git
- `.prettierignore` - Prevents files from being formatted by Prettier
- `.eslintignore` - Built into `eslint.config.mjs` as an `ignores` array
- `.gitattributes` - Controls how Git treats specific file types

## Patterns Explanation

### Common Ignored Categories

1. **Dependencies**

   - `node_modules`, `.pnp.*`, `.yarn/*`
   - Rationale: These are installed packages that should be fetched by package managers, not stored in the repository.

2. **Build Outputs**

   - `.next/`, `out/`, `build/`, `dist/`
   - Rationale: Generated code that can be rebuilt and shouldn't be version controlled.

3. **Cache and Logs**

   - `.eslintcache`, `.turbo`, `.cache`, `*.log`
   - Rationale: Temporary files that are generated during development and not needed for others.

4. **Config Files**

   - Some configuration files are ignored by linting/formatting but tracked by Git.
   - Rationale: Often auto-generated or follow specific formats that shouldn't be altered.

5. **Environment Files**

   - `.env*` (with exceptions for templates)
   - Rationale: Contain sensitive information like API keys that shouldn't be in the repository.

6. **Editor Files**
   - `.idea/`, `.vscode/` (with some exceptions)
   - Rationale: Editor-specific settings that may not be relevant to all developers.

## Special Patterns

### Negation Patterns

The `!` prefix indicates exceptions to ignore rules:

```
.env*        # Ignore all .env files
!.env.example # But include the example template
```

### Directory vs File Patterns

- Patterns with trailing slash (`dir/`) only match directories
- Patterns without trailing slash match both files and directories with that name

### Glob Patterns

- `*` matches any sequence of characters except `/`
- `**` matches any sequence of characters including `/` (recursive)
- `?` matches a single character
- `[abc]` matches any character in the set
- `[!abc]` matches any character not in the set

## Consistency Across Tools

We maintain consistent ignore patterns across Git, ESLint, and Prettier for predictability.

## Maintenance

When adding new file types or build processes to the project, remember to update the ignore files accordingly.

## Best Practices

1. Be specific in your patterns
2. Group related patterns with comments
3. Use negation patterns (`!`) sparingly and document their purpose
4. Keep patterns consistent across all tools
5. Review ignore patterns periodically as the project evolves
