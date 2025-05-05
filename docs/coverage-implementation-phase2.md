# Phase 2: Coverage Expansion and Refinement Plan

This document outlines the implementation plan for Phase 2 of the ECON1500 E2E coverage setup. It expands on the minimal implementation from Phase 1 to include more refined coverage fixtures, threshold configuration, and additional test coverage.

## Implementation Progress Tracking

- [x] Step 1: Enhance Coverage Fixtures
- [x] Step 2: Create Threshold Configuration
- [x] Step 3: Convert Key Test Files
- [x] Step 4: Implement HTML Reporting
- [x] Step 5: Create LCOV Export Script
- [x] Step 6: Update Scripts in package.json
- [x] Step 7: Validate Enhanced Implementation

## Prerequisites

Before starting Phase 2, ensure that Phase 1 is successfully implemented and validated:

- Minimal coverage collection works for a single test
- Coverage report is generated without errors
- The basic infrastructure (directories, scripts) is in place

## Step 1: Enhance Coverage Fixtures

Enhance the existing coverage fixture to include CSS coverage and support multiple browsers:

```typescript
// tests/coverage-fixtures.ts - Enhanced version
import { test as base, TestInfo } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";
import v8ToIstanbul from "v8-to-istanbul";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Environment feature flags
const skipCoverage = process.env.SKIP_COVERAGE === "1";
const skipCssCoverage = process.env.SKIP_CSS_COVERAGE === "1";
const debugCoverage = process.env.DEBUG_COVERAGE === "1";

/**
 * Enhanced remapping function with improved extension handling and debugging
 */
async function remap(entry) {
  if (debugCoverage) {
    console.log(`Remapping coverage for: ${entry.url}`);
  }

  try {
    // Handle CSS files differently
    if (entry.url.endsWith(".css")) {
      // CSS files don't need the same processing as JS files
      return entry;
    }

    const converter = v8ToIstanbul(entry.url);
    await converter.load();
    entry.functions = converter.applyConversions(entry.functions);

    // Better source map handling for TypeScript
    if (entry.url.endsWith(".js")) {
      // Enhanced list of possible extensions
      const possibleExtensions = [".tsx", ".ts", ".jsx", ".mjs", ".svelte", ".vue"];
      let mappedUrl = entry.url;

      try {
        const filePath = fileURLToPath(entry.url);
        const basePath = filePath.slice(0, -3); // Remove .js extension

        // First check if source map file exists
        const mapPath = `${filePath}.map`;
        if (fs.existsSync(mapPath)) {
          if (debugCoverage) {
            console.log(`Source map found for: ${entry.url}`);
          }
          // Source map handling would go here in a more comprehensive implementation
        }

        // Try different extensions
        for (const ext of possibleExtensions) {
          const testPath = basePath + ext;
          if (fs.existsSync(testPath)) {
            // Convert back to URL format
            mappedUrl = "file://" + testPath.replace(/\\/g, "/");
            if (debugCoverage) {
              console.log(`Remapped ${entry.url} → ${mappedUrl}`);
            }
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
    if (debugCoverage) {
      console.error(error);
    }
  }
  return entry;
}

/**
 * Enhanced coverage collection fixture that supports:
 * - All major browser engines (Chromium, Firefox, WebKit)
 * - Optional CSS coverage
 * - Debug logging
 * - Error resilience
 */
export const test = base.extend<{}, { autoV8Coverage: boolean }>({
  autoV8Coverage: [
    async ({ page }, use, testInfo: TestInfo) => {
      // Skip coverage collection if the feature flag is enabled
      if (skipCoverage) {
        await use(true);
        return;
      }

      // Coverage is supported in Chromium by default
      // Firefox and WebKit have more limited support
      const isChromium = testInfo.project.name.toLowerCase().includes("chromium");

      if (isChromium) {
        try {
          // Start JS coverage collection
          await page.coverage.startJSCoverage({
            resetOnNavigation: false,
            reportAnonymousScripts: true,
          });

          // Only start CSS coverage if not explicitly skipped
          if (!skipCssCoverage) {
            await page.coverage.startCSSCoverage({
              resetOnNavigation: false,
            });
          }

          if (debugCoverage) {
            console.log(`Started coverage collection for test: ${testInfo.title}`);
          }
        } catch (error) {
          console.warn(`Failed to start coverage: ${error.message}`);
        }
      }

      await use(true);

      if (isChromium) {
        try {
          // Create promises for both coverage types
          const jsCovPromise = page.coverage.stopJSCoverage();
          const cssCovPromise = !skipCssCoverage
            ? page.coverage.stopCSSCoverage()
            : Promise.resolve([]);

          // Collect both types of coverage
          const [jsCov, cssCov] = await Promise.all([jsCovPromise, cssCovPromise]);

          if (debugCoverage) {
            console.log(`Collected ${jsCov.length} JS and ${cssCov.length} CSS coverage entries`);
          }

          // Combine JS and CSS coverage
          const combined = [...jsCov, ...cssCov];
          const remapped = await Promise.all(combined.map(remap));

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

          if (debugCoverage) {
            console.log(
              `Processed ${remapped.length} total coverage entries for: ${testInfo.title}`
            );
          }
        } catch (error) {
          console.warn(`Failed to process coverage: ${error.message}`);
          if (debugCoverage) {
            console.error(error);
          }
        }
      }
    },
    { scope: "test", auto: true },
  ],
});

export const expect = test.expect;
```

## Step 2: Create Threshold Configuration

Create a centralized threshold configuration in `config/coverage-thresholds.js`:

```javascript
/**
 * Centralized coverage thresholds configuration
 *
 * These thresholds are initially set conservatively to establish a baseline.
 * They should be gradually increased as coverage improves.
 */
module.exports = {
  // Global thresholds applied to the entire codebase
  global: {
    lines: 60, // Starting with a moderate target
    functions: 50, // Functions can be harder to cover fully
    branches: 40, // Branch coverage is typically the most challenging
    statements: 60, // Similar to line coverage
  },

  // Directory-specific thresholds for critical paths
  // These can be more stringent for core functionality
  critical: {
    // Auth flows are critical and should have higher coverage
    "lib/auth": {
      lines: 80,
      functions: 70,
      branches: 60,
      statements: 80,
    },

    // Socket functionality is critical for real-time features
    "lib/socket": {
      lines: 75,
      functions: 70,
      branches: 50,
      statements: 75,
    },

    // Other critical modules can be added here
    // "components/ui": { ... }
  },
};
```

## Step 3: Convert Key Test Files

Update 3-5 key test files to use the enhanced coverage fixtures. Target files that cover critical application paths.

For each file, update the import statement:

```typescript
// For each test file like session-management.spec.ts, form-validation.spec.ts, etc.
import { test, expect } from "../coverage-fixtures";
// Rest of the file remains unchanged
```

## Step 4: Implement HTML Reporting

Update the Playwright configuration in `playwright.config.ts` to include enhanced monocart-reporter settings:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { mergeConfig, PlaywrightReporterConfig } from "monocart-reporter";
import * as thresholds from "./config/coverage-thresholds";
import fs from "fs";
import path from "path";

export default mergeConfig<PlaywrightReporterConfig>(
  defineConfig({
    testDir: "./tests/e2e",
    // ... your existing configuration ...

    // Add enhanced reporter configuration
    reporter: [
      ["list"],
      [
        "monocart-reporter",
        {
          name: "ECON1500 E2E Coverage Report",
          outputFile: "./monocart-report/index.html",

          // Enable these options for better reporting
          reportOptions: {
            showTest: true, // Show test information
            showSuite: true, // Show suite information
            showError: true, // Display detailed error reports
            showScreenshot: true, // Include screenshots
            timeNeeded: true, // Show execution time
          },

          // Coverage configuration options
          coverage: {
            // Only include relevant files
            entryFilter: (entry) => {
              return (
                entry.url?.includes("/app/") ||
                entry.url?.includes("/components/") ||
                entry.url?.includes("/lib/") ||
                entry.url?.includes("/utils/")
              );
            },

            // Source file filtering
            sourceFilter: (sourcePath) => {
              return (
                sourcePath.includes("/app/") ||
                sourcePath.includes("/components/") ||
                sourcePath.includes("/lib/") ||
                sourcePath.includes("/utils/") ||
                sourcePath.includes("/hooks/")
              );
            },
          },

          // Report generation when tests complete
          onEnd: (allCoverage, testInfo) => {
            const outputDir = "./monocart-report";
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            // Always write out the raw coverage data for debugging and further processing
            fs.writeFileSync(
              path.join(outputDir, "raw-coverage.json"),
              JSON.stringify(allCoverage, null, 2)
            );

            // In Phase 2, we're not enforcing thresholds yet - just collecting data
            // This will be expanded in Phase 3
          },
        } as PlaywrightReporterConfig,
      ],
    ],

    // Include global teardown from Phase 1
    globalTeardown: require.resolve("./global-teardown.ts"),

    // Keep running existing config properties
    // ...
  })
);
```

## Step 5: Create LCOV Export Script

Create a script for exporting coverage data to LCOV format for tool integration:

```javascript
// scripts/export-lcov.js
import fs from "fs";
import path from "path";
import { writeLcov } from "monocart-reporter";

/**
 * Standardized coverage data access
 *
 * This function provides consistent access to coverage data,
 * with fallbacks to ensure data is available even if tests fail.
 */
function getCoverageData() {
  const covPath = path.resolve("./monocart-report/coverage.json");
  const rawCovPath = path.resolve("./monocart-report/raw-coverage.json");

  try {
    if (fs.existsSync(covPath)) {
      console.log("✅ Using coverage.json for LCOV export");
      return JSON.parse(fs.readFileSync(covPath, "utf8"));
    }

    if (fs.existsSync(rawCovPath)) {
      console.log("✅ Using raw-coverage.json for LCOV export (tests may have failed)");
      return JSON.parse(fs.readFileSync(rawCovPath, "utf8"));
    }

    throw new Error("No coverage files found");
  } catch (error) {
    console.error(`❌ Error accessing coverage data: ${error.message}`);
    process.exit(1);
  }
}

(async () => {
  try {
    // Get coverage data using the standardized function
    const jsonData = getCoverageData();

    try {
      // Generate LCOV content
      const lcov = await writeLcov(jsonData);
      const lcovPath = "./coverage.lcov";
      fs.writeFileSync(lcovPath, lcov);

      // Verify and report success
      if (fs.existsSync(lcovPath)) {
        const stats = fs.statSync(lcovPath);
        console.log(
          `✅ Generated coverage.lcov (${(stats.size / 1024).toFixed(2)} KB) for ECON1500 codebase`
        );
      } else {
        throw new Error("Failed to write LCOV file");
      }
    } catch (lcovError) {
      console.error("❌ Error generating LCOV content:", lcovError);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error reading coverage data:", error);
    process.exit(1);
  }
})();
```

## Step 6: Update Scripts in package.json

Add enhanced scripts to your `package.json`:

```json
"scripts": {
  // ... existing scripts ...

  // Enhanced scripts for Phase 2
  "pretest:e2e:coverage": "rimraf ./.v8-coverage && mkdir -p ./.v8-coverage && mkdir -p ./monocart-report",

  // Single test with coverage (from Phase 1)
  "test:e2e:coverage:single": "cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test tests/e2e/auth.spec.ts --project=chromium",

  // Run multiple core tests with coverage
  "test:e2e:coverage:core": "cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test tests/e2e/auth.spec.ts tests/e2e/session-management.spec.ts tests/e2e/form-validation.spec.ts --project=chromium",

  // Run all tests with coverage
  "test:e2e:coverage": "cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test",

  // Run tests without CSS coverage for better performance
  "test:e2e:coverage:nocss": "cross-env NODE_V8_COVERAGE=./.v8-coverage SKIP_CSS_COVERAGE=1 playwright test",

  // Skip coverage entirely when not needed
  "test:e2e:coverage:skip": "cross-env SKIP_COVERAGE=1 npm run test:e2e",

  // Enable debug logging for coverage troubleshooting
  "test:e2e:coverage:debug": "cross-env NODE_V8_COVERAGE=./.v8-coverage DEBUG_COVERAGE=1 playwright test tests/e2e/auth.spec.ts --project=chromium",

  // Export to LCOV format for tool integration
  "coverage:lcov": "node scripts/export-lcov.js",

  // Serve coverage report (from Phase 1)
  "coverage:view": "npx monocart serve-report ./monocart-report -p 8080",

  // Auto scripts that combine test execution and report viewing
  "test:e2e:coverage:core:auto": "npm run test:e2e:coverage:core && npm run coverage:view",
  "test:e2e:coverage:auto": "npm run test:e2e:coverage && npm run coverage:view",
  "test:e2e:coverage:nocss:auto": "npm run test:e2e:coverage:nocss && npm run coverage:view"
}
```

## Step 7: Validate Enhanced Implementation

After implementing the steps above, validate the expanded coverage setup:

```bash
# First run the core tests to validate the enhanced setup
npm run test:e2e:coverage:core

# Or use the fully automated version that also serves the report
npm run test:e2e:coverage:core:auto

# Then try with and without CSS coverage to compare performance
npm run test:e2e:coverage:nocss
# Or automatically run and view report
npm run test:e2e:coverage:nocss:auto

# Generate LCOV file for potential tool integration
npm run coverage:lcov
```

The coverage report will be automatically served at http://localhost:8080 when using any of the `:auto` scripts.

## Implementation Validation Checklist

- [x] Enhanced coverage fixtures work with multiple tests
- [x] CSS coverage is collected when enabled
- [x] Thresholds configuration is in place (but not enforced yet)
- [x] Multiple test files use the coverage fixtures
- [x] HTML reports include test details and screenshots
- [x] LCOV export works for tool integration
- [x] Performance impact of coverage collection is acceptable
- [x] No TypeScript errors in the implementation
- [x] No linting errors in the documentation
- [x] All e2e tests pass

## Troubleshooting Common Issues

1. **CSS coverage performance**: If CSS coverage causes significant slowdowns, use the `test:e2e:coverage:nocss` script.
2. **Memory issues**: For large test suites, you may need to adjust Node.js memory limits with `NODE_OPTIONS=--max_old_space_size=4096`.
3. **Coverage not appearing for some files**: Check the `entryFilter` and `sourceFilter` settings to ensure files aren't being excluded.
4. **Browser compatibility**: Remember that full coverage collection is only available in Chromium-based browsers.

## Next Steps

After successfully implementing Phase 2, you'll be ready for Phase 3, which will include:

1. Converting all remaining tests
2. Enforcing coverage thresholds
3. Adding CI integration
4. Implementing coverage maintenance workflows

---

## Implementation Notes

- Date started: **\*\***\_\_\_**\*\***
- Implementation completed: **June 2024**
- Coverage percentage after Phase 2: **\*\***\_\_\_**\*\***
- Team members involved: **\*\***\_\_\_**\*\***
- Notable challenges: **\*\***\_\_\_**\*\***
