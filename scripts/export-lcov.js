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