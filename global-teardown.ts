import fs from "fs";
import path from "path";
import { addCoverageReport } from "monocart-reporter";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

interface MockTestInfo {
    attachments: {
        create: (name: string, options: {
            path?: string;
            body?: string | object;
            contentType: string;
        }) => void;
    };
    project: { name: string };
    // Add any other required properties that are used
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CoverageEntry = any;

/**
 * Processes V8 coverage files and generates a coverage report
 */
const globalTeardown = async () => {
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
            const raw = JSON.parse(fs.readFileSync(fp, "utf8"));

            // More robust filtering with explicit node_modules exclusion
            const entries = raw.result
                .filter((e: CoverageEntry) => e.url?.startsWith("file:"))
                .filter((e: CoverageEntry) => {
                    const url = e.url?.toLowerCase() || "";
                    return (
                        (url.includes("/app/") ||
                            url.includes("/components/") ||
                            url.includes("/lib/") ||
                            url.includes("/utils/") ||
                            url.includes("/hooks/")) &&
                        !url.includes("node_modules")
                    );
                })
                .map((e: CoverageEntry) => {
                    try {
                        // Improved file path handling
                        const filePath = fileURLToPath(e.url);
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
                .filter(Boolean); // Remove nulls

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
                create: (name: string, options: { path?: string; body?: string | object; contentType: string }) => {
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
        };

        // Use as any to bypass the type checking for the mock object
        // This is acceptable here as we know the mock implements the required interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await addCoverageReport(allEntries, mockTestInfo as any);
        console.log("✅ Coverage report generated successfully!");

        // Write raw coverage data for debugging
        fs.writeFileSync(
            path.join(outputDir, "raw-coverage.json"),
            JSON.stringify(allEntries, null, 2)
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Failed to generate coverage report:", error.message);
        } else {
            console.error("❌ Failed to generate coverage report: Unknown error");
        }
        // Don't exit with error in Phase 1 to avoid blocking workflow
    }
};

export default globalTeardown; 