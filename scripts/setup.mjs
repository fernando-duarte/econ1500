#!/usr/bin/env node

// Using console.warn instead of console.log to comply with the project's ESLint rules
console.warn('📦 Running post-install setup...');

// ES Module imports
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check and create .env.local if doesn't exist
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

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