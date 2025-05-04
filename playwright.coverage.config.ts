import { defineConfig, devices } from "@playwright/test";

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
        name: "ECON1500 Coverage Report",
        outputFile: "./coverage-report/index.html",
        coverage: {
          entryFilter: () => true,
          sourceFilter: (sourcePath: string) => {
            // Only include app, components, lib directories
            return /\/(app|components|lib)\//.test(sourcePath);
          },
          reports: ["v8", "console-details"],
          lcov: true,
        },
      },
    ],
  ],
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
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev", // Command to start the Next.js dev server
    url: "http://localhost:3000", // URL to wait for before starting tests
    reuseExistingServer: !process.env.CI, // Reuse dev server if already running locally
    timeout: 120 * 1000, // Increase timeout for starting the server
  },
});
