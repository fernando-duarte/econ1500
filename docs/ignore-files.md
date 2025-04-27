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

   - `.eslintcache`, `.turbo`, `.cache`, `.swc/`, `*.log`
   - Rationale: Temporary files that are generated during development and not needed for others.

4. **Config Files**

   - Some configuration files are ignored by linting/formatting but tracked by Git.
   - Rationale: Often auto-generated or follow specific formats that shouldn't be altered.
   - Examples: `next-env.d.ts`, `next.config.js`, `next.config.ts`, `tailwind.config.js`, `tailwind.config.mjs`, `postcss.config.mjs`

5. **Environment Files**

   - `.env*` (with exceptions for templates)
   - Rationale: Contain sensitive information like API keys that shouldn't be in the repository.

6. **Editor Files**

   - `.idea/`, `.vscode/` (with some exceptions)
   - Rationale: Editor-specific settings that may not be relevant to all developers.
   - Also includes: `*.suo`, `*.ntvs*`, `*.njsproj`, `*.sln`, `*.sw?`, `*.swp`, `*.swo`

7. **Cursor Files**

   - `.cursor/*` (with exception for rules)
   - Rationale: Cursor IDE-specific files that shouldn't be shared.
   - Exception: `!.cursor/rules/` - Shared rules for the Cursor IDE are tracked.

8. **High-resolution Source Image Files**

   - `/src-images/` - Directory containing original source image files
   - Specific naming patterns used for source files:
     - `*_source.*` - Files with "\_source" suffix (original versions)
     - `*_original.*` - Files with "\_original" suffix (unmodified versions)
     - `*_raw.*` - Files with "\_raw" suffix (unprocessed versions)
   - Design source files:
     - `*.psd` - Adobe Photoshop files
     - `*.ai` - Adobe Illustrator files
     - `*.fig` - Figma export files
   - Specific directory patterns:
     - `/public/hero/*_remix_*.png` - Generated remix PNG files in the hero directory

## Special Patterns

### Negation Patterns

The `!` prefix indicates exceptions to ignore rules:

```
.env*        # Ignore all .env files
!.env.example # But include the example template
!.env.template # And include the template file

.cursor/*    # Ignore all Cursor IDE files
!.cursor/rules/ # But include the shared rules
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
