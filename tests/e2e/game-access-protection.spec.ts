import { test, expect } from '@playwright/test';

test.describe('Game Access Protection', () => {
    test.beforeEach(async ({ context }) => {
        // Clear cookies before each test
        await context.clearCookies();
        // Note: We're not clearing localStorage as it's causing security errors
        // The test is still valid since we create a new browser context for each test
    });

    test('should prevent unauthenticated users from accessing game page directly', async ({ page }) => {
        // Attempt to access the game page directly without authentication
        await page.goto('/game');

        // Verify that we're redirected to the login page (not on game page)
        await expect(page).not.toHaveURL(/\/game/);

        // Verify the login form is visible, confirming redirection to login page
        const nameInput = page.getByRole('textbox', { name: 'Name' });
        await expect(nameInput).toBeVisible();

        // Verify the URL contains the returnUrl parameter pointing back to the game page
        // This is consistent with the behavior observed in session-management.spec.ts
        await expect(page.url()).toContain('returnUrl=');

        // Check for encoded version of /game which is %2Fgame in the URL
        expect(page.url()).toContain('%2Fgame');
    });
}); 