#!/usr/bin/env node

import { spawn } from 'child_process';

// Get test file argument if provided
const testFile = process.argv[2] || '';

// Spawn process that sets reporter to line only
const args = ['playwright', 'test', '--reporter=line'];

// Add test file if provided
if (testFile) {
    args.push(testFile);
}

// Run the test
const testProcess = spawn('npx', args, {
    stdio: 'inherit',
    shell: true
});

// Handle process exit
testProcess.on('close', (code) => {
    process.exit(code);
}); 