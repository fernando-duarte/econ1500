import { test as baseTest, expect as baseExpect } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";
// Using dynamic import for v8-to-istanbul to avoid ESLint errors
import { createRequire } from "module";
import * as fs from "fs";
import { fileURLToPath } from "url";

// This type represents the structure of coverage entries
interface CoverageEntry {
  url: string;
  functions: unknown[];
  source?: string;
  [key: string]: unknown;
}

// Get require function from module using __filename (more TypeScript compatible)
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const v8ToIstanbul = require("v8-to-istanbul");

// Environment feature flag to allow skipping coverage when needed
const skipCoverage = process.env.SKIP_COVERAGE === "1";

// Enhanced remapping function with better extension handling
async function remap(entry: CoverageEntry): Promise<CoverageEntry> {
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
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.warn(`Error processing file path for ${entry.url}: ${e.message}`);
        } else {
          console.warn(`Unknown error processing file path for ${entry.url}`);
        }
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn(`Warning: Failed to remap ${entry.url}: ${error.message}`);
    } else {
      console.warn(`Warning: Failed to remap ${entry.url}: Unknown error`);
    }
  }
  return entry;
}

// Create a simpler fixture extension with proper typings
type CoverageFixture = {
  autoV8Coverage: boolean;
};

// Extend the base test with coverage collection as a test-scoped fixture
const test = baseTest.extend<CoverageFixture>({
  autoV8Coverage: [
    async ({ page }, use, testInfo) => {
      // Skip coverage collection if the feature flag is enabled
      if (skipCoverage) {
        await use(true);
        return;
      }

      // Only collect coverage in Chromium for now
      const isChromium = testInfo.project.name.toLowerCase() === "chromium";

      if (isChromium && page.coverage) {
        try {
          // Start JS coverage collection only (no CSS yet)
          await page.coverage.startJSCoverage({
            resetOnNavigation: false,
            reportAnonymousScripts: true,
          });
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.warn(`Failed to start coverage: ${error.message}`);
          } else {
            console.warn(`Failed to start coverage: Unknown error`);
          }
        }
      }

      await use(true);

      if (isChromium && page.coverage) {
        try {
          const jsCov = await page.coverage.stopJSCoverage();
          const remapped = await Promise.all(jsCov.map(remap));

          // Add worker ID to ensure proper merging in parallel execution
          if (process.env.TEST_WORKER_INDEX) {
            testInfo.attachments.push({
              name: `worker-${process.env.TEST_WORKER_INDEX}-coverage`,
              contentType: "application/json",
              body: Buffer.from(JSON.stringify(remapped)),
            });
          }

          // Add coverage report
          await addCoverageReport(remapped, testInfo);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.warn(`Failed to process coverage: ${error.message}`);
          } else {
            console.warn(`Failed to process coverage: Unknown error`);
          }
        }
      }
    },
    { scope: "test", auto: true },
  ],
});

const expect = baseExpect;

export { test, expect };
