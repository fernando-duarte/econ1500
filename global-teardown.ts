import "ts-node/register";
import * as fs from "fs";
import * as path from "path";
import { addCoverageReport } from "monocart-reporter";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

interface MockTestInfo {
  attachments: {
    create: (
      name: string,
      options: {
        path?: string;
        body?: string | object;
        contentType: string;
      }
    ) => void;
  };
  project: { name: string };
  config: {
    rootDir: string;
  };
  // Add any other required properties that are used
}

// Define more specific types for Coverage entries
interface CoverageFunction {
  functionName: string;
  ranges: { start: number; end: number }[];
  isBlockCoverage: boolean;
}

interface CoverageEntry {
  url: string;
  source?: string;
  functions: CoverageFunction[];
  result?: unknown;
  [key: string]: unknown;
}

/**
 * Processes V8 coverage files and generates a coverage report
 */
const globalTeardown = async (config: { rootDir: string }) => {
  // Feature flag for skipping coverage collection
  if (process.env.SKIP_COVERAGE === "1") {
    console.log("Coverage collection skipped via SKIP_COVERAGE flag");
    return;
  }

  const dir = "./.v8-coverage";
  if (!fs.existsSync(dir)) {
    console.warn("⚠️ V8 coverage directory not found. Skipping coverage collection.");
    return;
  }

  // Create output directory
  const outputDir = "./monocart-report";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
  if (files.length === 0) {
    console.warn("⚠️ No coverage files found in .v8-coverage directory.");
    return;
  }

  // Limit concurrency to avoid excessive file I/O
  const limit = pLimit(3);

  // Process files with better error handling
  const processFile = async (file: string): Promise<CoverageEntry[]> => {
    const fp = path.join(dir, file);
    try {
      const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as { result: CoverageEntry[] };

      // Debug: log all URLs before filtering
      console.log(`Found ${raw.result.length} entries in ${file}`);

      // Log the first few URLs to see what we're working with
      if (raw.result.length > 0) {
        console.log("Sample URLs:");
        raw.result.slice(0, 3).forEach((e: CoverageEntry) => {
          console.log(`  URL: ${e.url}`);
        });
      }

      // More robust filtering with explicit node_modules exclusion
      const entriesAfterFirstFilter = raw.result.filter(
        (e: CoverageEntry) => e.url?.startsWith("file:") || e.url?.startsWith("http://localhost")
      );
      console.log(`  After first filter: ${entriesAfterFirstFilter.length} entries`);

      // Debug: print some sample URLs that are being filtered
      if (entriesAfterFirstFilter.length > 0) {
        console.log("SAMPLE URLs AFTER FIRST FILTER:");
        entriesAfterFirstFilter.slice(0, 10).forEach((e: CoverageEntry) => {
          console.log(`  URL: ${e.url}`);
        });
      }

      const entriesAfterPathFilter = entriesAfterFirstFilter.filter((e: CoverageEntry) => {
        const url = e.url?.toLowerCase() || "";

        // Accept everything except node_modules and internal node stuff
        if (url.includes("node_modules") || url.startsWith("node:")) {
          return false;
        }

        // Accept almost everything else
        return true;
      });
      console.log(`  After path filter: ${entriesAfterPathFilter.length} entries`);

      if (entriesAfterPathFilter.length > 0) {
        console.log("SAMPLE PATHS THAT PASSED FILTER:");
        entriesAfterPathFilter.slice(0, 10).forEach((e: CoverageEntry) => {
          console.log(`  URL passed: ${e.url}`);
        });
      }

      const entries = entriesAfterPathFilter
        .map((e: CoverageEntry) => {
          try {
            // Handle HTTP URLs
            if (e.url?.startsWith("http://localhost")) {
              // For HTTP URLs, just include them but don't try to fetch the source
              // since we're just trying to get a working report for now
              console.log(`  Including HTTP URL without source: ${e.url}`);
              // Add a dummy source to avoid errors
              e.source = "// Source not available for client-side code";
              return e;
            }

            // Handle file URLs
            const filePath = fileURLToPath(e.url);
            console.log(`  Trying to access: ${filePath}`);
            if (fs.existsSync(filePath)) {
              e.source = fs.readFileSync(filePath, "utf8");
              return e;
            }
            console.warn(`File not found: ${filePath}`);
            return null;
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.warn(`Could not read source for ${e.url}: ${err.message}`);
            } else {
              console.warn(`Could not read source for ${e.url}: Unknown error`);
            }
            return null;
          }
        })
        .filter(Boolean as unknown as <T>(x: T | null) => x is T); // Remove nulls

      console.log(`  Final entries after file check: ${entries.length}`);
      return entries;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(`Error processing ${file}: ${error.message}`);
      } else {
        console.warn(`Error processing ${file}: Unknown error`);
      }
      return [];
    }
  };

  // Process files in parallel with limited concurrency
  const allEntriesArrays = await Promise.all(files.map((file) => limit(() => processFile(file))));

  // Flatten array of arrays
  const allEntries = allEntriesArrays.flat();

  if (allEntries.length === 0) {
    console.warn("⚠️ No valid coverage entries found after processing.");
    return;
  }

  console.log(`✅ Processing ${allEntries.length} coverage entries from ${files.length} files.`);

  try {
    // Create a mock testInfo-like object with required methods
    const mockTestInfo: MockTestInfo = {
      attachments: {
        create: (
          name: string,
          options: { path?: string; body?: string | object; contentType: string }
        ) => {
          console.log(`📎 Creating attachment: ${name}`);
          if (options.body) {
            const attachmentPath = path.join(outputDir, `${name}.json`);
            fs.writeFileSync(
              attachmentPath,
              typeof options.body === "string" ? options.body : JSON.stringify(options.body)
            );
          }
        },
      },
      project: { name: "GlobalTeardown" },
      config: {
        rootDir: config.rootDir || process.cwd(),
      },
    };

    // We need to use type assertion since monocart-reporter's TestInfo type
    // isn't fully compatible with our simplified MockTestInfo
    type ReportFunction = typeof addCoverageReport;
    type TestInfoParam = Parameters<ReportFunction>[1];
    await addCoverageReport(allEntries, mockTestInfo as unknown as TestInfoParam);
    console.log("✅ Coverage report generated successfully!");

    // Write raw coverage data for debugging
    fs.writeFileSync(
      path.join(outputDir, "raw-coverage.json"),
      JSON.stringify(allEntries, null, 2)
    );

    // Create a simple HTML file that points to the raw coverage data
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E Test Coverage Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .summary {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .summary h2 {
            margin-top: 0;
        }
        .files {
            margin-bottom: 20px;
        }
        .file-item {
            margin-bottom: 8px;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>E2E Test Coverage Report</h1>
        
        <div class="summary">
            <h2>Summary</h2>
            <p>This report shows the code coverage collected during E2E tests.</p>
            <p>Files Processed: ${files.length}</p>
            <p>Coverage Entries: ${allEntries.length}</p>
        </div>
        
        <div class="files">
            <h2>Coverage Data</h2>
            <div class="file-item">
                <a href="raw-coverage.json" download>Download Raw Coverage Data (JSON)</a>
            </div>
        </div>
        
        <div class="notes">
            <h2>Notes</h2>
            <p>This is a minimal report. For a more detailed view, you can process the raw-coverage.json file with coverage visualization tools.</p>
        </div>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, "index.html"), htmlContent);
    console.log("✅ HTML report generated at ./monocart-report/index.html");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to generate coverage report:", error.message);
    } else {
      console.error("Failed to generate coverage report:", error);
    }
  }
};

export default globalTeardown;
