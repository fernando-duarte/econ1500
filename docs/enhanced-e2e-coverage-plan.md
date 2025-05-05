# Enhanced End-to-End V8 Coverage Plan with Monocart-Reporter for ECON1500

This document outlines the complete, detailed setup to collect, merge, and enforce V8 coverage for your ECON1500 Next.js application's Playwright tests using Monocart-Reporter, with enhancements for real-world pitfalls, source-map remapping, cross-platform CI compatibility, and IDE/CI artifact integration.

---

## 📁 Directory Structure

```
econ1500/
├── package.json
├── playwright.config.ts             // Will be modified
├── global-teardown.js               // New file to be created
├── scripts/
│   ├── export-lcov.js               // New file to be created
│   └── coverage-smoke-check.js      // Optional daily smoke check script
│
├── config/
│   └── coverage-thresholds.js       // Coverage threshold configuration
│
├── tests/
│   ├── coverage-fixtures.ts         // New file to be created
│   └── e2e/                         // Your existing E2E test directory
│       └── ... existing spec files
│
├── .v8-coverage/                    // Raw V8 JSON outputs from the Next.js server
│   ├── coverage-0.json
│   ├── coverage-1.json
│   └── …
│
└── monocart-report/                 // Generated coverage report
    ├── index.html
    ├── coverage.json
    └── assets/
        └── ... report assets
```

---

## 🔧 Dependencies & Scripts

Add to your **package.json**:

```json
{
  "devDependencies": {
    "monocart-reporter": "^x.y.z",
    "rimraf": "^5.x",
    "cross-env": "^7.x",
    "v8-to-istanbul": "^9.x",
    "p-limit": "^4.x",
    "coveralls": "^3.x"
  },
  "scripts": {
    "pretest:e2e": "rimraf ./.v8-coverage && mkdir -p ./.v8-coverage && mkdir -p ./monocart-report",
    "test:e2e:coverage": "npm run pretest:e2e && cross-env NODE_V8_COVERAGE=./.v8-coverage playwright test",
    "test:e2e:coverage:nocss": "npm run pretest:e2e && cross-env NODE_V8_COVERAGE=./.v8-coverage SKIP_CSS_COVERAGE=1 playwright test",
    "coverage:lcov": "node scripts/export-lcov.js",
    "coverage:coveralls": "npm run coverage:lcov && coveralls < coverage.lcov",
    "coverage:smoke": "node scripts/coverage-smoke-check.js"
  }
}
```

---

## 🛠 Playwright Configuration with Thresholds & CI Artifacts

First, create a separate threshold configuration file **config/coverage-thresholds.js**:

```js
// Centralized coverage thresholds configuration
module.exports = {
  global: {
    lines: 80,
    functions: 75,
    branches: 70,
    statements: 80,
  },
  // Optional: per-directory thresholds for critical code
  critical: {
    lines: 90,
    functions: 85,
    branches: 80,
    statements: 90,
  },
};
```

Then update your **playwright.config.ts**:

```ts
import { defineConfig, devices } from '@playwright/test';
import { mergeConfig, PlaywrightReporterConfig, CoverageSummary } from 'monocart-reporter';
import * as thresholds from './config/coverage-thresholds';

export default mergeConfig<PlaywrightReporterConfig>(
  defineConfig({
    testDir: './tests/e2e',
    timeout: 30_000,
    // Enable parallel test execution while ensuring proper coverage collection
    workers: process.env.CI ? 2 : undefined,
    use: {
      baseURL: 'http://localhost:3000',
      headless: true,
      trace: 'on-first-retry',
    },
    projects: [
      { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
      { name: 'WebKit',   use: { ...devices['Desktop Safari'] } },
    ],
    reporter: [
      ['list'],
      ['monocart-reporter', {
        name: 'ECON1500 E2E Coverage Report',
        outputFile: './monocart-report/index.html',
        // Important: enables merging coverage from parallel workers
        mergeCoverageFiles: true,
        coverage: {
          entryFilter: entry => {
            return entry.url?.includes('/app/') ||
                   entry.url?.includes('/components/') ||
                   entry.url?.includes('/lib/') ||
                   entry.url?.includes('/utils/') ||
                   entry.url?.includes('/hooks/');
          },
          sourceFilter: sourcePath => {
            return sourcePath.includes('/app/') ||
                   sourcePath.includes('/components/') ||
                   sourcePath.includes('/lib/') ||
                   sourcePath.includes('/utils/') ||
                   sourcePath.includes('/hooks/');
          },
        },
        onEnd: (allCoverage, testInfo) => {
          const summary: CoverageSummary = testInfo.attachments.getCoverageSummary(allCoverage);

          const failures = (Object.keys(thresholds.global) as Array<keyof typeof thresholds.global>)
            .map((key) => {
              const actual = summary[key].pct;
              const required = thresholds.global[key];
              return actual < required
                ? `${key}: ${actual.toFixed(1)}% < ${required}%`
                : null;
            })
            .filter((msg): msg is string => !!msg);

          if (failures.length > 0) {
            // Attach raw coverage.json as artifact for CI systems
            testInfo.attachments.create('coverage-json', {
              body: JSON.stringify(allCoverage),
              contentType: 'application/json'
            });
            throw new Error('Coverage thresholds not met:\n' + failures.join('\n'));
          }
        }
      } as PlaywrightReporterConfig]]
    ],
    globalTeardown: require.resolve('./global-teardown.js'),
  })
);
```

---

## 🧩 Per-Test V8 Coverage Fixture with Configurable CSS Coverage

Create **tests/coverage-fixtures.ts**:

```ts
import { test as base, TestInfo } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";
import v8ToIstanbul from "v8-to-istanbul";

// Get the environment variable to determine if CSS coverage should be skipped
const skipCssCoverage = process.env.SKIP_CSS_COVERAGE === "1";

// Helper to remap TS coverage
async function remap(entry) {
  try {
    const converter = v8ToIstanbul(entry.url);
    await converter.load();
    entry.functions = converter.applyConversions(entry.functions);
    entry.url = entry.url.replace(/\.js$/, ".ts");
  } catch {
    // Fallback: keep original
  }
  return entry;
}

export const test = base.extend<{}, { autoV8Coverage: boolean }>({
  autoV8Coverage: [
    async ({ page }, use, testInfo: TestInfo) => {
      const isChromium = testInfo.project.name === "Chromium";
      if (isChromium) {
        // Start JS coverage always
        await page.coverage.startJSCoverage({ resetOnNavigation: false });

        // Only start CSS coverage if not skipped (for performance)
        if (!skipCssCoverage) {
          await page.coverage.startCSSCoverage({ resetOnNavigation: false });
        }
      }

      await use(true);

      if (isChromium) {
        const jsCovPromise = page.coverage.stopJSCoverage();
        const cssCovPromise = !skipCssCoverage
          ? page.coverage.stopCSSCoverage()
          : Promise.resolve([]);

        const [jsCov, cssCov] = await Promise.all([jsCovPromise, cssCovPromise]);

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

        await addCoverageReport(remapped, testInfo);
      }
    },
    { scope: "test", auto: true },
  ],
});
export const expect = test.expect;
```

Update your existing E2E tests to use the coverage fixture:

```ts
// Change in all test files in tests/e2e/
import { test, expect } from "../coverage-fixtures";
```

---

## 🌐 Server-Side V8 Coverage Collection

For local development:

```bash
npm run pretest:e2e   # cleans .v8-coverage
cross-env NODE_V8_COVERAGE=./.v8-coverage npm run dev
# In another terminal window:
npm run test:e2e:coverage
```

For faster tests (without CSS coverage):

```bash
npm run test:e2e:coverage:nocss
```

---

## 🔁 Enhanced Global Teardown with Parallel Processing

Create **global-teardown.js**:

```js
import fs from "fs";
import path from "path";
import { addCoverageReport } from "monocart-reporter";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

export default async () => {
  const dir = "./.v8-coverage";
  if (!fs.existsSync(dir)) {
    console.warn("⚠️ V8 coverage directory not found. Skipping coverage collection.");
    return;
  }

  // Create output dir if it doesn't exist
  const outputDir = "./monocart-report";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Limit concurrency to avoid excessive file I/O
  const limit = pLimit(5);
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.warn("⚠️ No coverage files found in .v8-coverage directory.");
    return;
  }

  const processFile = async (file) => {
    const fp = path.join(dir, file);
    let raw;

    try {
      raw = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch (e) {
      console.warn(`⚠️ Skipping invalid file ${file}: ${e.message}`);
      return null;
    }

    // Filter to relevant files in the ECON1500 codebase
    const entries = raw.result
      .filter((e) => e.url?.startsWith("file:"))
      .filter((e) => {
        const url = e.url;
        return (
          url.includes("/app/") ||
          url.includes("/components/") ||
          url.includes("/lib/") ||
          url.includes("/utils/") ||
          url.includes("/hooks/")
        );
      })
      .map((e) => {
        try {
          const filePath = fileURLToPath(e.url);
          // Use async file read for better performance
          e.source = fs.readFileSync(filePath, "utf8");
          return e;
        } catch (err) {
          console.warn(`⚠️ Could not read source for ${e.url}: ${err.message}`);
          return null;
        }
      })
      .filter(Boolean); // Remove nulls

    return entries;
  };

  // Process files in parallel with concurrency limit
  const allEntryArrays = await Promise.all(files.map((file) => limit(() => processFile(file))));

  // Flatten array of arrays and filter out nulls
  const allEntries = allEntryArrays.filter(Boolean).flat();

  if (allEntries.length === 0) {
    console.warn("⚠️ No valid coverage entries found after processing.");
    return;
  }

  console.log(`✅ Processing ${allEntries.length} coverage entries from ${files.length} files.`);
  await addCoverageReport(allEntries, {});
  console.log("✅ Coverage report generated successfully!");
};
```

---

## 📑 Export LCOV for CI Integration

Create **scripts/export-lcov.js**:

```js
import fs from "fs";
import path from "path";
import { writeLcov } from "monocart-reporter";

(async () => {
  const covPath = path.resolve("./monocart-report/coverage.json");

  try {
    if (!fs.existsSync(covPath)) {
      console.error("❌ coverage.json not found — run tests first.");
      process.exit(1);
    }

    const all = JSON.parse(fs.readFileSync(covPath, "utf8"));
    const lcov = await writeLcov(all);
    fs.writeFileSync("./coverage.lcov", lcov);
    console.log("✅ Generated coverage.lcov for ECON1500 codebase");
  } catch (error) {
    console.error("❌ Error generating LCOV file:", error);
    process.exit(1);
  }
})();
```

---

## 🔄 Optional Daily Coverage Smoke Check

Create **scripts/coverage-smoke-check.js**:

```js
import fs from "fs";
import path from "path";
import * as thresholds from "../config/coverage-thresholds";

/**
 * Lightweight script to run as a daily check that coverage hasn't regressed
 * significantly without running the full test suite.
 */
(async () => {
  const covPath = path.resolve("./monocart-report/coverage.json");
  const REGRESSION_THRESHOLD = 5; // Percentage points allowed to drop

  if (!fs.existsSync(covPath)) {
    console.error("❌ No coverage report found. Run tests first.");
    process.exit(1);
  }

  try {
    const coverage = JSON.parse(fs.readFileSync(covPath, "utf8"));
    const summary = {
      lines: { total: 0, covered: 0 },
      statements: { total: 0, covered: 0 },
      functions: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
    };

    // Calculate summary
    for (const file of Object.values(coverage)) {
      for (const metric of Object.keys(summary)) {
        if (file[metric]) {
          summary[metric].total += file[metric].total;
          summary[metric].covered += file[metric].covered;
        }
      }
    }

    // Calculate percentages
    const results = {};
    let failed = false;

    for (const [metric, data] of Object.entries(summary)) {
      const pct = data.total ? (data.covered / data.total) * 100 : 0;
      const targetThreshold = thresholds.global[metric];
      const minAcceptable = targetThreshold - REGRESSION_THRESHOLD;

      results[metric] = {
        percentage: pct.toFixed(2),
        target: targetThreshold,
        minimum: minAcceptable,
        pass: pct >= minAcceptable,
      };

      if (!results[metric].pass) failed = true;
    }

    // Output results
    console.log("\n📊 Coverage Smoke Check Results:");
    console.log("-------------------------------");
    for (const [metric, result] of Object.entries(results)) {
      const icon = result.pass ? "✅" : "❌";
      console.log(
        `${icon} ${metric}: ${result.percentage}% (target: ${result.target}%, min: ${result.minimum}%)`
      );
    }

    if (failed) {
      console.error("\n❌ Coverage has regressed significantly! Review changes.");
      process.exit(1);
    } else {
      console.log("\n✅ Coverage is within acceptable range.");
    }
  } catch (error) {
    console.error("❌ Error checking coverage:", error);
    process.exit(1);
  }
})();
```

**CI workflow with Coveralls integration**:

```yaml
# Example GitHub Actions workflow step
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:e2e:coverage

      - name: Export LCOV
        run: npm run coverage:lcov

      - name: Upload coverage to Coveralls
        uses: coverallsapp/github-action@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Upload HTML report as artifact
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: monocart-report
          retention-days: 14
```

---

## 📊 Interpreting Coverage Reports

The Monocart coverage report provides several views to help you understand the test coverage:

1. **Summary View** - Shows overall metrics (lines, statements, functions, branches)
2. **File Explorer** - Drill down into directories and files
3. **Uncovered Line Highlighting** - Red highlights show untested code
4. **Function Coverage** - Details which functions were called during tests

### Example Report Screenshots

![Summary View](https://via.placeholder.com/800x400?text=Summary+View+Example)

The summary view shows overall metrics and a directory breakdown.

![File Detail View](https://via.placeholder.com/800x400?text=File+Detail+View+Example)

The file detail view highlights covered (green) and uncovered (red) code.

### Troubleshooting Low Coverage

If you find areas with low coverage:

1. Check if the code is actually reachable through user interactions
2. Add test cases for edge cases and error handling paths
3. Review the uncovered functions list to identify gaps
4. Focus on critical paths in the application first

---

## 🚩 Implementation Checklist

- [ ] Install new dependencies: `npm install --save-dev monocart-reporter rimraf cross-env v8-to-istanbul p-limit coveralls`
- [ ] Create the coverage threshold configuration in `config/coverage-thresholds.js`
- [ ] Update `package.json` with the enhanced scripts
- [ ] Update `playwright.config.ts` with parallel-safe coverage configuration
- [ ] Create `tests/coverage-fixtures.ts` with configurable CSS coverage support
- [ ] Update imports in existing E2E tests to use the coverage fixture
- [ ] Create `global-teardown.js` with parallelized file processing
- [ ] Create `scripts/export-lcov.js` for CI integration
- [ ] Create `scripts/coverage-smoke-check.js` for daily verification
- [ ] Set appropriate coverage thresholds for the ECON1500 project
- [ ] Add CI configuration for report artifact storage
- [ ] Test the complete workflow locally before pushing to CI

This enhanced plan provides advanced features like:

- Merging coverage from multiple worker processes
- Cross-platform compatibility using `cross-env`
- Configurable CSS coverage to improve performance
- Source-map remapping for accurate TypeScript coverage
- Parallel file processing in the teardown for better performance
- Centralized threshold configuration for maintainability
- CI artifact support for coverage reports and Coveralls integration
- Daily smoke check to catch significant coverage regressions
- Detailed report interpretation guide for the team
