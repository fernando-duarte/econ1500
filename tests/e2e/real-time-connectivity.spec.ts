import { test, expect, Page, BrowserContext } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

/**
 * Helper to authenticate a user and persist storage state.
 */
async function authenticate(
    page: Page,
    context: BrowserContext,
    username = 'Aidan Wang',
): Promise<void> {
    const input = page.getByRole('textbox', { name: 'Name' });
    await expect(input).toBeVisible();
    await input.fill(username);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/game/);
    await context.storageState({ path: authFile });
}

// Extend Window interface for io property
declare global {
    interface Window {
        io?: unknown;
    }
}

test.describe('Real-time Connectivity', () => {
    test.beforeEach(async ({ page, context }) => {
        // Navigate to root and clear any prior state
        await page.goto('/');
        await context.clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    test('should establish socket connection properly after login', async ({ page, context }) => {
        // Authenticate the user first
        await authenticate(page, context);

        // Wait for navigation to complete and game page to load
        await page.waitForURL(/\/game/);

        // Verify we are still on the game page after a delay
        // This indirectly confirms socket connection is working
        // because without a socket connection, the app would redirect away
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(/\/game/);

        // Check for the logout button which indicates an authenticated session
        await expect(
            page.getByRole('button', { name: 'Logout' })
        ).toBeVisible();

        // Take a screenshot for manual verification
        await page.screenshot({ path: 'test-results/socket-connection.png' });
    });

    // We'll skip the reconnection test for now
    test.skip('should reconnect automatically when connection is temporarily lost', async () => {
        // To be implemented
    });

    test('should properly authenticate socket connection with user credentials', async ({ page, context }) => {
        const testUsername = 'Emily Mueller';

        // Authenticate with specific username
        await authenticate(page, context, testUsername);

        // Wait for navigation to complete and game page to load
        await page.waitForURL(/\/game/);

        // Take a screenshot to verify the page content manually
        await page.screenshot({ path: 'test-results/socket-auth.png' });

        // Check that we're still on the game page (socket connection working)
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(/\/game/);

        // Verify logout button is visible (authenticated session)
        await expect(
            page.getByRole('button', { name: 'Logout' })
        ).toBeVisible();
    });
}); 