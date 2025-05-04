#!/usr/bin/env node

// Using console.warn instead of console.log to comply with the project's ESLint rules
console.warn('📦 Running post-install setup...');

// ES Module imports
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use relative paths from the script's directory
const rootDir = path.join(__dirname, '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
    console.warn('🔧 Creating .env.local from example template...');
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.warn('✅ Created .env.local successfully');
}

// Run husky install
try {
    console.warn('🐶 Setting up Husky hooks...');
    execSync('npx husky install', { stdio: 'inherit' });
    console.warn('✅ Husky hooks installed');
} catch (error) {
    console.error('❌ Failed to install Husky hooks:', error.message);
}

console.warn('✨ Setup complete!'); 