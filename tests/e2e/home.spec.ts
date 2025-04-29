import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load successfully and display key elements', async ({ page }) => {
        // Navigate to the home page
        await page.goto('/');

        // Check for the main heading in the card
        await expect(
            page.locator('h2:has-text("Join the Game")'),
        ).toBeVisible();

        // Check for the "Get Started" button in the hero
        // Note: This assumes the Hero component renders a button with this text.
        // If the Hero component structure is different, this selector might need adjustment.
        await expect(
            page.locator('button:has-text("Get Started")'),
        ).toBeVisible();

        // Optional: Check if the name input field is present
        await expect(page.locator('input#name')).toBeVisible();
    });
}); 