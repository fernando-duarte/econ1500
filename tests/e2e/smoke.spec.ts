import { test, expect } from './coverage-fixture';

test.describe('Smoke Tests', () => {
    test('should load the homepage and find the game form heading', async ({ page }) => {
        // Navigate to the base URL defined in playwright.config.ts
        await page.goto('/');

        // Verify the H2 heading inside the game form card is visible
        await expect(
            page.getByRole('heading', { name: 'Join the Game', level: 2 }),
        ).toBeVisible();

        // Optional: Verify the 'Get Started' button is visible
        // await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    });

    // Add more basic smoke tests here later (e.g., accessibility checks)
});

test.describe('Navigation and Basic Flow', () => {
    test('should allow user to enter name and navigate to game page', async ({ page }) => {
        const playerName = 'TestPlayer';

        // Start on the homepage
        await page.goto('/');

        // Find the name input by its label and fill it
        await page.getByLabel('Your Name').fill(playerName);

        // Find the 'Join Game' button and click it
        await page.getByRole('button', { name: 'Join Game' }).click();

        // Wait for navigation and verify the URL
        await page.waitForURL('/game');
        await expect(page).toHaveURL('/game');

        // Verify a key element on the game page is visible
        await expect(
            page.getByRole('heading', { name: 'Game Dashboard', level: 2 }),
        ).toBeVisible();

        // Optional: Verify player name is displayed
        // await expect(page.getByTestId('player-name-display')).toContainText(playerName);
    });

    test('should allow user to exit the game and return to homepage', async ({ page }) => {
        const playerName = 'TestPlayerExit';

        // --- Setup: Join the game ---
        await page.goto('/');
        await page.getByLabel('Your Name').fill(playerName);
        await page.getByRole('button', { name: 'Join Game' }).click();
        await page.waitForURL('/game');
        await expect(
            page.getByRole('heading', { name: 'Game Dashboard', level: 2 }),
        ).toBeVisible(); // Ensure we are on the game page

        // --- Action: Exit the game ---
        await page.getByRole('button', { name: 'Exit Game' }).click();

        // --- Verification: Back on homepage ---
        await page.waitForURL('/');
        await expect(page).toHaveURL('/');
        await expect(
            page.getByRole('heading', { name: 'Join the Game', level: 2 }),
        ).toBeVisible(); // Verify homepage element is visible again
    });

    test('should disable Join Game button for empty or whitespace-only names', async ({ page }) => {
        // Start on the homepage
        await page.goto('/');

        const nameInput = page.getByLabel('Your Name');
        const joinButton = page.getByRole('button', { name: 'Join Game' });

        // Verify button is initially disabled
        await expect(joinButton).toBeDisabled();

        // Enter only spaces
        await nameInput.fill('   ');

        // Verify button is still disabled
        await expect(joinButton).toBeDisabled();

        // Enter valid text
        await nameInput.fill('ValidName');

        // Verify button is enabled
        await expect(joinButton).toBeEnabled();
    });

    // Add more navigation/flow tests later
}); 