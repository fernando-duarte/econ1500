#!/usr/bin/env node

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, "..");

// Path to the original Playwright config file
const configPath = path.join(rootDir, "playwright.config.ts");

// Make a backup of the original config file
const backupConfigPath = path.join(rootDir, "playwright.config.backup.ts");
fs.copyFileSync(configPath, backupConfigPath);

try {
  // Read the current config
  let configContent = fs.readFileSync(configPath, "utf8");

  // Replace the reporter configuration to use only line reporter
  const reporterRegex = /reporter:\s*\[\s*\["html"\]\s*,\s*\["line"\]\s*,?[^\]]*\]/;
  const updatedReporterConfig = 'reporter: [["line"]]';

  if (reporterRegex.test(configContent)) {
    configContent = configContent.replace(reporterRegex, updatedReporterConfig);
    fs.writeFileSync(configPath, configContent);

    console.log("Running tests with non-interactive reporter...");

    // Run the tests
    const result = spawnSync("npx", ["playwright", "test"], {
      stdio: "inherit",
      shell: true,
    });

    // Restore the original config
    fs.copyFileSync(backupConfigPath, configPath);
    fs.unlinkSync(backupConfigPath);

    process.exit(result.status);
  } else {
    console.error("Could not find reporter configuration in playwright.config.ts");
    process.exit(1);
  }
} catch (error) {
  console.error("Error:", error);

  // Try to restore the config if it exists
  if (fs.existsSync(backupConfigPath)) {
    fs.copyFileSync(backupConfigPath, configPath);
    fs.unlinkSync(backupConfigPath);
  }

  process.exit(1);
}
