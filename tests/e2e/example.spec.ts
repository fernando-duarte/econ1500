import { test, expect } from '@playwright/test';

test.describe('Example test suite', () => {
    test('has title', async ({ page }) => {
        await page.goto('/');

        // Example test that checks the page title
        // Replace with actual tests when ready
        await expect(page).toHaveTitle(/ECON 1500/);
    });

    // Add more tests here as needed
}); 