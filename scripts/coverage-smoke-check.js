import fs from "fs";
import path from "path";
import thresholds from "../config/coverage-thresholds.js";

/**
 * Lightweight script to run as a daily check that coverage hasn't regressed
 * significantly without running the full test suite.
 */
(async () => {
    const covPath = path.resolve("./monocart-report/coverage.json");
    const rawCovPath = path.resolve("./monocart-report/raw-coverage.json");
    const REGRESSION_THRESHOLD = 5; // Percentage points allowed to drop

    // Set exit code for CI integration
    let exitCode = 0;

    let jsonData;

    if (fs.existsSync(covPath)) {
        jsonData = JSON.parse(fs.readFileSync(covPath, "utf8"));
    } else if (fs.existsSync(rawCovPath)) {
        jsonData = JSON.parse(fs.readFileSync(rawCovPath, "utf8"));
    } else {
        console.error("❌ No coverage report found. Run tests first.");
        process.exit(1);
    }

    try {
        const coverage = jsonData;
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
            exitCode = 1;
        } else {
            console.log("\n✅ Coverage is within acceptable range.");
        }

        // Also check critical paths
        console.log("\n🔍 Critical Paths Check:");
        console.log("-------------------------------");

        for (const [dir, dirThresholds] of Object.entries(thresholds.critical)) {
            // Filter coverage data for this directory
            const dirEntries = Object.values(coverage).filter((entry) => entry.path?.includes(dir));

            if (dirEntries.length === 0) {
                console.warn(`⚠️ No coverage data found for critical path: ${dir}`);
                continue;
            }

            // Calculate directory summary
            const dirSummary = {};
            for (const key of Object.keys(dirThresholds)) {
                dirSummary[key] = { total: 0, covered: 0 };

                for (const entry of dirEntries) {
                    if (entry[key]) {
                        dirSummary[key].total += entry[key].total;
                        dirSummary[key].covered += entry[key].covered;
                    }
                }
            }

            // Check thresholds for this directory
            console.log(`\n${dir}:`);
            let dirFailed = false;

            for (const [key, threshold] of Object.entries(dirThresholds)) {
                const data = dirSummary[key];
                const pct = data.total ? (data.covered / data.total) * 100 : 0;
                const minAcceptable = threshold - REGRESSION_THRESHOLD;
                const pass = pct >= minAcceptable;

                if (!pass) dirFailed = true;

                const icon = pass ? "✅" : "❌";
                console.log(
                    `${icon} ${key}: ${pct.toFixed(2)}% (target: ${threshold}%, min: ${minAcceptable}%)`
                );
            }

            if (dirFailed) {
                console.error(`❌ Critical path ${dir} has regressed significantly!`);
                exitCode = 1;
            }
        }
    } catch (error) {
        console.error("❌ Error checking coverage:", error);
        exitCode = 1;
    }

    process.exit(exitCode);
})(); 