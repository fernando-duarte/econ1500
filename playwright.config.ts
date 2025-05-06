// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { resolve } from "path";
import * as path from "path";
import thresholds from "./config/coverage-thresholds.js";
import * as fs from "fs";

// Get the directory name directly since we're in a module
const __dirname = process.cwd();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config();

// Define interfaces for the coverage data structure
interface CoverageEntry {
  url?: string;
  path?: string;
  [key: string]: unknown;
}

interface CoverageSummary {
  [key: string]: { total: number; covered: number; pct: number };
}

interface TestInfoAttachments {
  getCoverageSummary: (coverage: Record<string, CoverageEntry>) => CoverageSummary;
  create: (name: string, options: { body: string; contentType: string }) => void;
}

interface TestInfo {
  attachments: TestInfoAttachments;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e", // Point to the directory containing your e2e tests
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 6,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["line"], // More compact for CI logs
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

        // Add parser options at the root level
        parserOptions: {
          // Use standard babel config
          configFile: path.resolve(__dirname, 'babel-parser.config.js'),
          // Source type as module to handle import/export
          sourceType: 'module',
          // For TypeScript files
          plugins: ['typescript', 'jsx', 'decorators-legacy']
        },

        // Coverage configuration options
        coverage: {
          // Only include relevant files
          entryFilter: (entry: CoverageEntry) => {
            return (
              entry.url?.toString().includes("/app/") ||
              entry.url?.toString().includes("/components/") ||
              entry.url?.toString().includes("/lib/") ||
              entry.url?.toString().includes("/utils/")
            );
          },

          // Source file filtering
          sourceFilter: (sourcePath: string) => {
            return (
              sourcePath.includes("/app/") ||
              sourcePath.includes("/components/") ||
              sourcePath.includes("/lib/") ||
              sourcePath.includes("/utils/") ||
              sourcePath.includes("/hooks/")
            );
          },

          // Enhanced TypeScript parser configuration for coverage
          parserOptions: {
            // Use standard babel config
            configFile: path.resolve(__dirname, 'babel-parser.config.js'),
            // Source type as module to handle import/export
            sourceType: 'module',
            // For TypeScript files
            plugins: ['typescript', 'jsx', 'decorators-legacy']
          },
        },

        // Report generation when tests complete
        onEnd: (allCoverage: Record<string, CoverageEntry>, testInfo: TestInfo) => {
          const outputDir = "./monocart-report";
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Always write out the raw coverage data for debugging and further processing
          fs.writeFileSync(
            path.join(outputDir, "raw-coverage.json"),
            JSON.stringify(allCoverage, null, 2)
          );

          // Skip when running --list command
          if (!testInfo || !testInfo.attachments || !testInfo.attachments.getCoverageSummary) {
            console.log("⚠️ Coverage summary not available (possibly running with --list)");
            return;
          }

          // Get coverage summary
          const summary = testInfo.attachments.getCoverageSummary(allCoverage);

          // Skip threshold checks if bypass flag is set
          if (process.env.BYPASS_COVERAGE_THRESHOLDS === "1") {
            console.log(
              "⚠️ Coverage thresholds check bypassed via BYPASS_COVERAGE_THRESHOLDS flag"
            );
            return;
          }

          // Check global thresholds
          const failures = (Object.keys(thresholds.global) as Array<keyof typeof thresholds.global>)
            .map((key) => {
              const actual = summary[String(key)]?.pct ?? 0;
              const required = thresholds.global[key];
              return actual < required
                ? `${String(key)}: ${actual.toFixed(1)}% < ${required}%`
                : null;
            })
            .filter((msg): msg is string => !!msg);

          // Check critical directory-specific thresholds
          for (const [dir, dirThresholds] of Object.entries(thresholds.critical)) {
            // Get directory-specific coverage
            const dirEntries = Object.values(allCoverage).filter((entry: CoverageEntry) =>
              entry.path?.toString().includes(dir)
            );

            const dirSummary = dirEntries.reduce((acc: CoverageSummary, entry: CoverageEntry) => {
              // Accumulate coverage for this directory
              for (const key of Object.keys(dirThresholds)) {
                if (!acc[key]) {
                  acc[key] = { total: 0, covered: 0, pct: 0 };
                }

                const typedEntry = entry[key] as { total: number; covered: number } | undefined;
                if (typedEntry) {
                  acc[key].total += typedEntry.total;
                  acc[key].covered += typedEntry.covered;
                  if (acc[key].total > 0) {
                    acc[key].pct = (acc[key].covered / acc[key].total) * 100;
                  }
                }
              }
              return acc;
            }, {} as CoverageSummary);

            // Check each metric against the directory threshold
            for (const stringKey of Object.keys(dirThresholds)) {
              const typedDirThresholds = dirThresholds as Record<string, number>;
              const metric = dirSummary[stringKey];
              const threshold = typedDirThresholds[stringKey];

              if (metric && threshold !== undefined && metric.pct < threshold) {
                failures.push(`${dir} ${stringKey}: ${metric.pct.toFixed(1)}% < ${threshold}%`);
              }
            }
          }

          if (failures.length > 0) {
            // Attach coverage JSON for CI systems
            testInfo.attachments.create("coverage-json", {
              body: JSON.stringify(allCoverage),
              contentType: "application/json",
            });
            throw new Error("Coverage thresholds not met:\n" + failures.join("\n"));
          } else {
            console.log("✅ All coverage thresholds met!");
          }
        },
      },
    ],
  ],

  /* Add globalTeardown property */
  globalTeardown: resolve(__dirname, "./global-teardown.ts"),

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: "test-results",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000", // Default Next.js dev server port

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configuration for expect assertions */
  expect: {
    timeout: 5000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev", // Command to start the Next.js dev server
    url: "http://localhost:3000", // URL to wait for before starting tests
    reuseExistingServer: !process.env.CI, // Reuse dev server if already running locally
    timeout: 120 * 1000, // Increase timeout for starting the server
  },
});
