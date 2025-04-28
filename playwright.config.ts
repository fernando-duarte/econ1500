import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    // Standard Playwright HTML reporter
    ['html', { outputFolder: './test-results/playwright-report' }],
    
    // Monocart reporter with consolidated paths
    ['monocart-reporter', {
      name: "ECON1500 Test Report with Coverage",
      outputFile: './test-results/monocart-report.html',
      
      // Add coverage configuration
      coverage: {
        // Enable coverage collection
        enabled: true,
        
        // Enable global coverage (combines all tests into one report)
        global: true,
        
        // Set outputDir to ensure all assets are properly generated
        outputDir: './test-results/coverage',
        
        // Ensure assets are placed directly in the coverage directory
        assetsDir: './test-results/coverage/assets',
        
        reporter: [
          ['v8', {
            inline: true,
            assetsDir: './test-results/coverage/assets' // Explicitly set assets location
          }],
          'html',
          'text',
          'lcov',
          'json'
        ],
        
        // Include patterns - based on actual codebase structure
        include: [
          'app/**/*.{js,jsx,ts,tsx}',
          'components/**/*.{js,jsx,ts,tsx}',
          'lib/**/*.{js,jsx,ts,tsx}',
          'utils/**/*.{js,jsx,ts,tsx}',
        ],
        
        // Exclude patterns - based on actual gitignore and project structure
        exclude: [
          // Next.js specific exclusions
          '.next/**',
          'node_modules/**',
          
          // Test files
          'tests/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          'playwright-report/**',
          'test-results/**',
          
          // Build and config files
          'next.config.ts',
          'postcss.config.mjs',
          'tailwind.config.mjs',
          'eslint.config.mjs',
          'playwright.config.ts',
          'lint-staged.config.mjs',
          'tsconfig.json',
          'internal/**',
          'runtime.ts',
        ],
      }
    }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Next.js can take longer to start, especially with coverage
  },
}); 