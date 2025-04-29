import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';

// Define the fixture type (value doesn't matter for auto-fixtures)
type CoverageTestFixtures = {
    autoTestFixture: void; // Use void as it doesn't provide a value, just setup/teardown
};

// Extend the base test with our fixture
export const test = base.extend<CoverageTestFixtures>({
    autoTestFixture: [
        async ({ page }, use, testInfo) => {
            // Start coverage collection before test navigation/actions
            const isChromium = testInfo.project.name === 'chromium';

            if (isChromium) {
                try {
                    await Promise.all([
                        page.coverage.startJSCoverage({ resetOnNavigation: false }),
                        page.coverage.startCSSCoverage({ resetOnNavigation: false })
                    ]);
                } catch (error) {
                    console.error('Failed to start coverage:', error);
                    // Decide if you want to fail the test or just warn
                    // throw new Error(`Failed to start coverage: ${error.message}`);
                }
            }

            // Run the actual test
            await use(); // The 'void' here matches the fixture type

            // Stop coverage collection after the test
            if (isChromium) {
                try {
                    const [jsCoverage, cssCoverage] = await Promise.all([
                        page.coverage.stopJSCoverage(),
                        page.coverage.stopCSSCoverage()
                    ]);

                    // Combine coverage data; filter out potential null/empty entries if necessary
                    const coverageList = [...(jsCoverage || []), ...(cssCoverage || [])];

                    if (coverageList.length > 0) {
                        // Ensure addCoverageReport is available before calling
                        if (typeof addCoverageReport === 'function') {
                            await addCoverageReport(coverageList, testInfo);
                        } else {
                            console.warn('addCoverageReport function not available from monocart-reporter. Is the dependency installed correctly?');
                        }
                    } else {
                        console.warn(`No coverage data collected for test: ${testInfo.title}`);
                    }

                } catch (error) {
                    console.error('Failed to stop coverage or report:', error);
                    // Decide if you want to fail the test or just warn
                }
            }
        },
        { scope: 'test', auto: true } // Run automatically for each test
    ]
});

// Re-export expect for convenience
export { expect }; 