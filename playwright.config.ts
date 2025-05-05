// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import * as thresholds from "./config/coverage-thresholds";
import fs from "fs";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config();

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

        // Coverage configuration options
        coverage: {
          // Only include relevant files
          entryFilter: (entry: Record<string, unknown>) => {
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
        },

        // Report generation when tests complete
        onEnd: (allCoverage: Record<string, unknown>, testInfo: Record<string, unknown>) => {
          const outputDir = "./monocart-report";
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          // Always write out the raw coverage data for debugging and further processing
          fs.writeFileSync(
            path.join(outputDir, "raw-coverage.json"),
            JSON.stringify(allCoverage, null, 2)
          );

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
          const failures = (
            Object.keys(thresholds.global) as Array<keyof typeof thresholds.global>
          )
            .map((key) => {
              const actual = summary[key].pct;
              const required = thresholds.global[key];
              return actual < required ? `${key}: ${actual.toFixed(1)}% < ${required}%` : null;
            })
            .filter((msg): msg is string => !!msg);

          // Check critical directory-specific thresholds
          // @ts-expect-error - type is compatible but TypeScript complains
          for (const [dir, dirThresholds] of Object.entries(thresholds.critical)) {
            // Get directory-specific coverage
            const dirSummary = Object.values(allCoverage)
              .filter((entry: Record<string, unknown>) =>
                entry.path?.toString().includes(dir)
              )
              .reduce(
                (acc: Record<string, { total: number; covered: number; pct: number }>,
                  entry: Record<string, unknown>) => {
                  // Accumulate coverage for this directory
                  for (const key of Object.keys(dirThresholds) as Array<
                    keyof typeof dirThresholds
                  >) {
                    if (!acc[key]) {
                      acc[key] = { total: 0, covered: 0, pct: 0 };
                    }
                    if (entry[key]) {
                      acc[key].total += (entry[key] as any).total;
                      acc[key].covered += (entry[key] as any).covered;
                      if (acc[key].total > 0) {
                        acc[key].pct = (acc[key].covered / acc[key].total) * 100;
                      }
                    }
                  }
                  return acc;
                },
                {} as Record<string, { total: number; covered: number; pct: number }>
              );

            // Check each metric against the directory threshold
            for (const key of Object.keys(dirThresholds) as Array<keyof typeof dirThresholds>) {
              const typedDirSummary = dirSummary as Record<string, { total: number; covered: number; pct: number }>;
              if (typedDirSummary[key] && typedDirSummary[key].pct < dirThresholds[key]) {
                failures.push(
                  `${dir} ${key}: ${typedDirSummary[key].pct.toFixed(1)}% < ${dirThresholds[key]}%`
                );
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
      }
    ],
  ],

  /* Add globalTeardown property */
  globalTeardown: path.resolve(__dirname, "./global-teardown.ts"),

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
