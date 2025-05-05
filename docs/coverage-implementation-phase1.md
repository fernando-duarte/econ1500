# Phase 1: Minimal Viable Coverage Implementation Plan

This document outlines the improved implementation plan for Phase 1 of the ECON1500 E2E coverage setup. It includes progress tracking checkboxes and incorporates best practices based on the latest tool documentation and real-world implementation considerations.

## Implementation Progress Tracking

- [x] Step 1: Install Required Dependencies
- [x] Step 2: Create Enhanced Coverage Fixture
- [x] Step 3: Update Test File for Validation
- [x] Step 4: Create Robust Global Teardown
- [x] Step 5: Update Playwright Configuration
- [x] Step 6: Add Scripts to package.json
- [x] Step 7: Update .gitignore
- [x] Step 8: Run Initial Validation Test
- [x] Step 9: Review Initial Coverage Report

## Step 1: Install Required Dependencies

```bash
npm install --save-dev monocart-reporter v8-to-istanbul cross-env p-limit
```

> Note: You already have `rimraf` installed, so we don't need to add it.

## Step 2: Create Enhanced Coverage Fixture

Create a new file `tests/coverage-fixtures.ts` with improved remapping and error handling:

```typescript
import { test as base, TestInfo } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";
import v8ToIstanbul from "v8-to-istanbul";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Environment feature flag to allow skipping coverage when needed
const skipCoverage = process.env.SKIP_COVERAGE === "1";

// Enhanced remapping function with better extension handling
async function remap(entry) {
  try {
    const converter = v8ToIstanbul(entry.url);
    await converter.load(); // This await is required for proper loading
    entry.functions = converter.applyConversions(entry.functions);

    // Better source map handling for TypeScript
    if (entry.url.endsWith(".js")) {
      // More robust extension handling
      const possibleExtensions = [".tsx", ".ts", ".jsx", ".mjs"];
      let mappedUrl = entry.url;

      try {
        const filePath = fileURLToPath(entry.url);
        const basePath = filePath.slice(0, -3); // Remove .js extension

        for (const ext of possibleExtensions) {
          const testPath = basePath + ext;
          if (fs.existsSync(testPath)) {
            // Convert back to URL format
            mappedUrl = "file://" + testPath.replace(/\\/g, "/");
            break;
          }
        }

        entry.url = mappedUrl;
      } catch (e) {
        console.warn(`Error processing file path for ${entry.url}: ${e.message}`);
      }
    }
  } catch (error) {
    console.warn(`Warning: Failed to remap ${entry.url}: ${error.message}`);
  }
  return entry;
}

// Extend the base test with coverage collection
export const test = base.extend<{}, { autoV8Coverage: boolean }>({
  autoV8Coverage: [
    async ({ page }, use, testInfo: TestInfo) => {
      // Skip coverage collection if the feature flag is enabled
      if (skipCoverage) {
        await use(true);
        return;
      }

      // Only collect coverage in Chromium for now
      const isChromium = testInfo.project.name === "chromium";

      if (isChromium) {
        try {
          // Start JS coverage collection only (no CSS yet)
          await page.coverage.startJSCoverage({
            resetOnNavigation: false,
            reportAnonymousScripts: true,
          });
        } catch (error) {
          console.warn(`Failed to start coverage: ${error.message}`);
        }
      }

      await use(true);

      if (isChromium) {
        try {
          const jsCov = await page.coverage.stopJSCoverage();
          const remapped = await Promise.all(jsCov.map(remap));

          // Add worker ID to ensure proper merging in parallel execution
          if (process.env.TEST_WORKER_INDEX) {
            testInfo.attachments.create(`worker-${process.env.TEST_WORKER_INDEX}-coverage`, {
              path: "",
              body: JSON.stringify(remapped),
              contentType: "application/json",
            });
          }

          // Add coverage report
          await addCoverageReport(remapped, testInfo);
        } catch (error) {
          console.warn(`Failed to process coverage: ${error.message}`);
        }
      }
    },
    { scope: "test", auto: true },
  ],
});

export const expect = test.expect;
```

## Step 3: Update One Test File for Validation

Choose a single test file to validate the approach. For this example, we'll use `auth.spec.ts`:

```typescript
// Updated import path for auth.spec.ts
import { test, expect } from "../coverage-fixtures";
// Rest of the file remains unchanged
```

## Step 4: Create Robust Global Teardown

Create a new file `global-teardown.ts` at the root of your project with improved error handling and parallel processing:

```typescript
import fs from "fs";
import path from "path";
import { addCoverageReport } from "monocart-reporter";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

export default async () => {
  // Feature flag for skipping coverage collection
  if (process.env.SKIP_COVERAGE === "1") {
    console.log("Coverage collection skipped via SKIP_COVERAGE flag");
    return;
  }

  const dir = "./.v8-coverage";
  if (!fs.existsSync(dir)) {
    console.warn("⚠️ V8 coverage directory not found. Skipping coverage collection.");
    return;
  }

  // Create output directory
  const outputDir = "./monocart-report";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
  if (files.length === 0) {
    console.warn("⚠️ No coverage files found in .v8-coverage directory.");
    return;
  }

  // Limit concurrency to avoid excessive file I/O
  const limit = pLimit(3);

  // Process files with better error handling
  const processFile = async (file) => {
    const fp = path.join(dir, file);
    try {
      const raw = JSON.parse(fs.readFileSync(fp, "utf8"));

      // More robust filtering with explicit node_modules exclusion
      const entries = raw.result
        .filter((e) => e.url?.startsWith("file:"))
        .filter((e) => {
          const url = e.url?.toLowerCase() || "";
          return (
            (url.includes("/app/") ||
              url.includes("/components/") ||
              url.includes("/lib/") ||
              url.includes("/utils/") ||
              url.includes("/hooks/")) &&
            !url.includes("node_modules")
          );
        })
        .map((e) => {
          try {
            // Improved file path handling
            const filePath = fileURLToPath(e.url);
            if (fs.existsSync(filePath)) {
              e.source = fs.readFileSync(filePath, "utf8");
              return e;
            }
            console.warn(`File not found: ${filePath}`);
            return null;
          } catch (err) {
            console.warn(`Could not read source for ${e.url}: ${err.message}`);
            return null;
          }
        })
        .filter(Boolean); // Remove nulls

      return entries;
    } catch (error) {
      console.warn(`Error processing ${file}: ${error.message}`);
      return [];
    }
  };

  // Process files in parallel with limited concurrency
  const allEntriesArrays = await Promise.all(files.map((file) => limit(() => processFile(file))));

  // Flatten array of arrays
  const allEntries = allEntriesArrays.flat();

  if (allEntries.length === 0) {
    console.warn("⚠️ No valid coverage entries found after processing.");
    return;
  }

  console.log(`✅ Processing ${allEntries.length} coverage entries from ${files.length} files.`);

  try {
    // Create a mock testInfo-like object with required methods
    const mockTestInfo = {
      attachments: {
        create: (name, options) => {
          console.log(`📎 Creating attachment: ${name}`);
          if (options.body) {
            const attachmentPath = path.join(outputDir, `${name}.json`);
            fs.writeFileSync(
              attachmentPath,
              typeof options.body === "string" ? options.body : JSON.stringify(options.body)
            );
          }
        },
      },
      project: { name: "GlobalTeardown" },
    };

    await addCoverageReport(allEntries, mockTestInfo);
    console.log("✅ Coverage report generated successfully!");

    // Write raw coverage data for debugging
    fs.writeFileSync(
      path.join(outputDir, "raw-coverage.json"),
      JSON.stringify(allEntries, null, 2)
    );
  } catch (error) {
    console.error("❌ Failed to generate coverage report:", error);
    // Don't exit with error in Phase 1 to avoid blocking workflow
  }
};
```

## Step 5: Update Playwright Configuration

Update your `playwright.config.ts` to include the global teardown:

```typescript
// Add this to your existing playwright.config.ts
export default defineConfig({
  // ... existing config ...

  // Add globalTeardown property
  globalTeardown: require.resolve("./global-teardown.ts"),

  // ... rest of config ...
});
```

## Step 6: Add Scripts to package.json

Add these scripts to your `package.json`:

```json
"scripts": {
  // ... existing scripts ...
  "pretest:e2e:coverage": "rimraf ./.v8-coverage && mkdir -p ./.v8-coverage && mkdir -p ./monocart-report",
  "test:e2e:coverage:single": "cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test tests/e2e/auth.spec.ts --project=chromium",
  "test:e2e:coverage:single:safe": "cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test tests/e2e/auth.spec.ts --project=chromium || echo 'Test may have failed but coverage will still be processed'",
  "test:e2e:coverage:skip": "cross-env SKIP_COVERAGE=1 npm run test:e2e",
  "coverage:view": "npx monocart serve-report ./monocart-report -p 8080",
  "test:e2e:coverage:single:auto": "npm run test:e2e:coverage:single && npm run coverage:view"
}
```

## Step 7: Update .gitignore

Add these entries to your `.gitignore` file to exclude coverage artifacts:

```
# Coverage reports
.v8-coverage/
monocart-report/
*.lcov
coverage.json
raw-coverage.json
```

## Step 8: Run Initial Validation Test

After implementing the steps above, validate the setup with:

```bash
npm run test:e2e:coverage:single
```

Or for a fully automated experience including report viewing:

```bash
npm run test:e2e:coverage:single:auto
```

## Step 9: Review Initial Coverage Report

The coverage report will be available at `./monocart-report/index.html` in your browser.

If you used the automated script, the report is automatically served at http://localhost:8080.

## Implementation Validation Checklist

- [x] Tests run successfully with coverage collection
- [x] The `.v8-coverage` directory contains JSON files after the test
- [x] The `global-teardown.ts` processes these files without errors
- [x] Coverage report is generated at `./monocart-report/index.html`
- [x] Console output confirms coverage entry processing
- [x] No TypeScript errors in the implementation
- [x] No linting errors in the documentation
- [x] All e2e tests pass

## Troubleshooting Common Issues

1. **Missing v8 coverage directory**: Ensure NODE_V8_COVERAGE is properly set and the directory is created.
2. **Empty coverage report**: Verify that your source files are properly mapped and not excluded by the filters.
3. **TypeScript errors**: Check that all imports are correctly specified and types are properly handled.
4. **File path errors**: Ensure fileURLToPath is used consistently when converting URLs to file paths.

## Next Steps

Once this minimal implementation is validated, you can proceed to Phase 2 with more confidence, including:

1. Enhancing coverage fixtures to include CSS coverage
2. Creating threshold configuration
3. Converting more test files to use the coverage fixtures
4. Implementing HTML reporting with more detailed configuration

---

## Implementation Notes

- Date started: **\*\***\_\_\_**\*\***
- Implementation completed: **\*\***\_\_\_**\*\***
- Initial coverage percentage: **\*\***\_\_\_**\*\***
- Team members involved: **\*\***\_\_\_**\*\***
- Notable challenges: **\*\***\_\_\_**\*\***
