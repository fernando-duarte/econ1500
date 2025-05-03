#!/usr/bin/env node

import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get the test file path from command line argument
const testFile = process.argv[2];

if (!testFile) {
    console.error('Please provide a test file path');
    console.error('Usage: node run-test-file.js tests/e2e/your-test-file.spec.ts');
    process.exit(1);
}

// Path to the original Playwright config file
const configPath = path.resolve(process.cwd(), 'playwright.config.ts');

// Make a backup of the original config file
const backupConfigPath = path.resolve(process.cwd(), 'playwright.config.backup.ts');
fs.copyFileSync(configPath, backupConfigPath);

try {
    // Read the current config
    let configContent = fs.readFileSync(configPath, 'utf8');

    // Replace the reporter configuration to use only line reporter
    const reporterRegex = /reporter:\s*\[\s*\["html"\]\s*,\s*\["line"\]\s*,?[^\]]*\]/;
    const updatedReporterConfig = 'reporter: [["line"]]';

    if (reporterRegex.test(configContent)) {
        configContent = configContent.replace(reporterRegex, updatedReporterConfig);
        fs.writeFileSync(configPath, configContent);

        console.log(`Running test file: ${testFile}`);

        // Run the specific test file
        const result = spawnSync('npx', ['playwright', 'test', testFile], {
            stdio: 'inherit',
            shell: true
        });

        // Restore the original config
        fs.copyFileSync(backupConfigPath, configPath);
        fs.unlinkSync(backupConfigPath);

        process.exit(result.status);
    } else {
        console.error('Could not find reporter configuration in playwright.config.ts');
        process.exit(1);
    }
} catch (error) {
    console.error('Error:', error);

    // Try to restore the config if it exists
    if (fs.existsSync(backupConfigPath)) {
        fs.copyFileSync(backupConfigPath, configPath);
        fs.unlinkSync(backupConfigPath);
    }

    process.exit(1);
} 