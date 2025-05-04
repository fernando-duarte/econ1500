// tests/e2e/fixtures.ts
import { test as base, expect } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";

// Extend the base test with automatic coverage collection
export const test = base.extend({
  // Auto fixture that will collect coverage data
  coverageFixture: [
    async ({ page }, use) => {
      // Check if we're running in Chromium (as coverage is only supported in Chromium)
      const isChromium = test.info().project.name === "chromium";

      // Start coverage collection if we're in Chromium
      if (isChromium) {
        await Promise.all([
          page.coverage.startJSCoverage({
            resetOnNavigation: false,
          }),
          page.coverage.startCSSCoverage({
            resetOnNavigation: false,
          }),
        ]);
      }

      // Use the fixture value (not important what the value is)
      await use("coverageFixture");

      // Stop coverage collection and add to report after test
      if (isChromium) {
        const [jsCoverage, cssCoverage] = await Promise.all([
          page.coverage.stopJSCoverage(),
          page.coverage.stopCSSCoverage(),
        ]);
        const coverageList = [...jsCoverage, ...cssCoverage];
        await addCoverageReport(coverageList, test.info());
      }
    },
    {
      scope: "test", // Run for each test
      auto: true, // Automatically use this fixture
    },
  ],
});

export { expect };
