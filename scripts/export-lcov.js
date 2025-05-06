// scripts/export-lcov.js
import fs from "fs";
import path from "path";

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

/**
 * Converts a URL to a file path
 */
function urlToPath(urlString) {
  try {
    // Handle file:// URLs
    if (urlString.startsWith("file://")) {
      const fileUrl = new URL(urlString);
      return decodeURIComponent(fileUrl.pathname);
    }
    return urlString;
  } catch {
    return urlString;
  }
}

/**
 * Recursively traverse an object to find coverage data
 */
function findCoverageEntries(obj, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return [];

  // If it's null or not an object, return empty array
  if (!obj || typeof obj !== "object") return [];

  // If it looks like a valid coverage entry with url and functions properties
  if (obj.url && obj.functions && Array.isArray(obj.functions)) {
    return [obj];
  }

  // If it's an array, process each element
  if (Array.isArray(obj)) {
    return obj.flatMap((item) => findCoverageEntries(item, depth + 1, maxDepth));
  }

  // If it's an object, process each value
  return Object.values(obj).flatMap((value) => findCoverageEntries(value, depth + 1, maxDepth));
}

/**
 * Generate LCOV format data from V8 coverage
 */
function generateLcov(coverageData) {
  console.log("Coverage data type:", typeof coverageData);

  // Try to extract actual coverage entries by recursively searching the data
  const coverageEntries = findCoverageEntries(coverageData);

  console.log("Total coverage entries found:", coverageEntries.length);

  // Log the first few URLs if we found any entries
  if (coverageEntries.length > 0) {
    console.log("Sample URLs (first 5):");
    coverageEntries.slice(0, 5).forEach((entry, i) => {
      console.log(`  ${i + 1}. ${entry.url}`);
    });
  }

  let lcovContent = [];
  let processedEntries = 0;

  // Process each script entry
  for (const entry of coverageEntries) {
    const filePath = urlToPath(entry.url);

    // Filter for only app/ components/ lib/ or utils/ paths
    // Also accept absolute paths that include these directories
    if (
      !filePath.includes("/app/") &&
      !filePath.includes("/components/") &&
      !filePath.includes("/lib/") &&
      !filePath.includes("/utils/")
    ) {
      continue;
    }

    console.log(`Processing file: ${filePath}`);

    // Skip if no functions data
    if (!entry.functions || !entry.functions.length) {
      console.log(`  No functions data for ${filePath}`);
      continue;
    }

    processedEntries++;

    // Start file section
    lcovContent.push(`TN:`);
    lcovContent.push(`SF:${filePath}`);

    // Track line execution counts
    const lineExecutionCounts = {};
    let linesFound = 0;
    let linesHit = 0;

    // Process each function
    let fnFound = 0;
    let fnHit = 0;

    for (const func of entry.functions) {
      // Skip if function has no ranges
      if (!func.ranges || !func.ranges.length) continue;

      fnFound++;

      // Only counts as hit if any range has a count > 0
      const isHit = func.ranges.some((range) => range.count > 0);
      if (isHit) {
        fnHit++;
      }

      // Function name and line (approximate as startOffset)
      const fnName = func.functionName || `(anonymous_${fnFound})`;
      lcovContent.push(`FN:${func.ranges[0]?.startOffset || 0},${fnName}`);
      lcovContent.push(`FNDA:${isHit ? 1 : 0},${fnName}`);

      // Calculate line coverage based on ranges
      for (const range of func.ranges) {
        // Ensure start and end offsets are valid
        if (range.startOffset === undefined || range.endOffset === undefined) continue;

        // Simple approximation: treat each offset as a separate line
        for (let offset = range.startOffset; offset <= range.endOffset; offset++) {
          if (!lineExecutionCounts[offset]) {
            lineExecutionCounts[offset] = 0;
            linesFound++;
          }

          if (range.count > 0) {
            lineExecutionCounts[offset] = Math.max(lineExecutionCounts[offset], range.count);
            if (lineExecutionCounts[offset] > 0) {
              linesHit++;
            }
          }
        }
      }
    }

    // Add function summary
    lcovContent.push(`FNF:${fnFound}`);
    lcovContent.push(`FNH:${fnHit}`);

    // Add line coverage data
    for (const [offset, count] of Object.entries(lineExecutionCounts)) {
      lcovContent.push(`DA:${offset},${count}`);
    }

    // Add line summary
    lcovContent.push(`LF:${linesFound}`);
    lcovContent.push(`LH:${linesHit}`);

    // End file section
    lcovContent.push(`end_of_record`);
  }

  console.log("Total processed entries:", processedEntries);

  return lcovContent.join("\n");
}

(async () => {
  try {
    // Get coverage data using the standardized function
    const jsonData = getCoverageData();
    const lcovPath = "./coverage.lcov";

    try {
      // Generate LCOV content
      const lcovContent = generateLcov(jsonData);

      // Write to file
      fs.writeFileSync(lcovPath, lcovContent);

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
