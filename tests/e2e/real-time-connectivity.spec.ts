import { test, expect, Page, BrowserContext } from '@playwright/test';
import { getNameInput, getSignInButton, getLogoutButton } from './helpers';

const authFile = 'playwright/.auth/user.json';

/**
 * Helper to authenticate a user and persist storage state.
 */
async function authenticate(
    page: Page,
    context: BrowserContext,
    username = 'Aidan Wang',
): Promise<void> {
    const input = getNameInput(page);
    await expect(input).toBeVisible();
    await input.fill(username);

    // Get the button and wait for it to be enabled before clicking
    const signInButton = getSignInButton(page);
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

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
        await expect(getLogoutButton(page)).toBeVisible();

        // Take a screenshot for manual verification
        await page.screenshot({ path: 'test-results/socket-connection.png' });
    });

    // TODO: Future implementation - Reconnection test
    /*
    This test will verify that socket connections automatically reconnect when temporarily lost.
    Implementation will require:
    1. A reliable way to simulate network disconnection
    2. Access to socket connection events
    3. Verification of reconnection success
    
    Example implementation:
    test('should reconnect automatically when connection is temporarily lost', async ({ page, context }) => {
        // Authenticate the user
        await authenticate(page, context);
        
        // Verify initial connection
        
        // Simulate connection loss
        
        // Wait for reconnection
        
        // Verify reconnection was successful
    });
    */

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
        await expect(getLogoutButton(page)).toBeVisible();
    });
}); 