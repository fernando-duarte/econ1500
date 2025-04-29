import { test as base, expect, Page } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

// Define the fixture type
type CoverageFixtures = {
  autoTestFixture: string;
};

// Extend the base test with coverage collection
const test = base.extend<CoverageFixtures>({
  // Auto-fixture that runs for each test automatically
  autoTestFixture: [
    async ({ page }: { page: Page }, use: (_value: string) => Promise<void>) => {
      // Check if we're using Chromium (coverage API is only available in Chromium)
      const isChromium = test.info().project.name === "chromium";

      // Start coverage collection if using Chromium
      if (isChromium) {
        await Promise.all([
          page.coverage.startJSCoverage({
            resetOnNavigation: false,
          }),
          // Optional: include CSS coverage
          page.coverage.startCSSCoverage({
            resetOnNavigation: false,
          }),
        ]);
      }

      // Continue with the test
      await use("autoTestFixture");

      // After test completion, collect and report coverage
      if (isChromium) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          page.coverage.stopCSSCoverage(),
        ]);

        // Combine JS and CSS coverage
        const coverageList = [...jsCoverage, ...cssCoverage];

        // Send coverage data to monocart-reporter
        await addCoverageReport(coverageList, test.info());
      }
    },
    {
      scope: "test",
      auto: true, // Automatically use this fixture for all tests
    },
  ],
});

export { test, expect };
