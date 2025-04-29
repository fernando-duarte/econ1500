import { test, expect } from '@playwright/test';

const TEST_PLAYER_NAME = 'E2E Tester';

test.describe('Game Page', () => {

    test('should redirect to homepage if navigating to /game without player name', async ({ page }) => {
        // Go directly to /game without setting localStorage
        await page.goto('/game');

        // Expect redirection to the homepage
        // Wait for homepage content to be visible
        await expect(page.locator('#game-form')).toBeVisible({ timeout: 15000 }); // Use a reliable element from the homepage
        await expect(page.getByRole('heading', { name: 'Join the Game' })).toBeVisible();
        await expect(page).toHaveURL('/'); // Confirm URL
    });

    test('should display game dashboard elements when navigated with player name', async ({ page, context }) => {
        // Set up local storage for this test
        await context.clearCookies(); // Clear context just in case
        await page.addInitScript((name) => {
            window.localStorage.setItem('playerName', name);
        }, TEST_PLAYER_NAME);

        await page.goto('/game');

        // Check for headers
        await expect(page.getByRole('heading', { name: 'ECON 1500' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Game Dashboard' })).toBeVisible();

        // Check for player name display
        const playerNameDisplay = page.locator('[data-testid="player-name-display"]');
        await expect(playerNameDisplay).toBeVisible();
        await expect(playerNameDisplay).toHaveText(`Player: ${TEST_PLAYER_NAME}`);

        // Check for Exit Game button
        await expect(page.getByRole('button', { name: 'Exit Game' })).toBeVisible();

        // Check for the main content card
        await expect(page.getByRole('heading', { name: 'Game Content Goes Here' })).toBeVisible();
        await expect(page.getByText(`Welcome, ${TEST_PLAYER_NAME}!`)).toBeVisible();
    });

    test('clicking Exit Game redirects to homepage and clears player name', async ({ page, context }) => {
        // Set up local storage for this test
        await context.clearCookies();
        await page.addInitScript((name) => {
            window.localStorage.setItem('playerName', name);
        }, TEST_PLAYER_NAME);
        await page.goto('/game');

        // Ensure we are on the game page first
        await expect(page.getByRole('heading', { name: 'Game Dashboard' })).toBeVisible();

        // Click Exit Game
        const exitButton = page.getByRole('button', { name: 'Exit Game' });
        await exitButton.click();

        // Wait for navigation to the homepage
        await expect(page.locator('#game-form')).toBeVisible({ timeout: 15000 });
        await expect(page).toHaveURL('/');

        // Verify local storage is cleared directly
        // Attempting to navigate back to /game and check for redirect is proving unreliable in test environment.
        const playerName = await page.evaluate(() => localStorage.getItem('playerName'));
        expect(playerName).toBeNull();
    });

}); 