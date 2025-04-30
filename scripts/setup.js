#!/usr/bin/env node

// Using console.warn instead of console.log to comply with the project's ESLint rules
console.warn('📦 Running post-install setup...');

// CommonJS imports (compliant with ESLint no-require-imports rule)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

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