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

test.describe('Session Management', () => {
    test.beforeEach(async ({ page, context }) => {
        // Navigate to login (root) and clear any prior state
        await page.goto('/');
        await context.clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    test('should maintain authentication when navigating between pages', async ({ page, context }) => {
        await authenticate(page, context);

        // Navigate within protected area
        await page.goto('/game/settings');
        // Should not be redirected
        await expect(page).toHaveURL(/\/game\/settings/);

        // Verify user name appears somewhere on page
        await expect(page.getByText('Aidan Wang')).toBeVisible();

        // Another protected page
        await page.goto('/game/leaderboard');
        await expect(page).toHaveURL(/\/game\/leaderboard/);

        // Session cookie still present
        const cookies = await context.cookies();
        expect(cookies.some(c => c.name === 'session-token')).toBeTruthy();
    });

    test('should redirect unauthenticated users to login page', async ({ page }) => {
        // Directly hit protected route
        await page.goto('/game');
        // Expect redirect back to root with returnUrl query
        await expect(page).toHaveURL(/\/\?returnUrl=\/game/);
        expect(page.url()).toContain('returnUrl=/game');

        // Then perform login
        await page.getByRole('textbox', { name: 'Name' }).fill('Hans Xu');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should clear session data on logout', async ({ page, context }) => {
        await authenticate(page, context);

        // Click logout
        await page.getByRole('button', { name: 'Logout' }).click();
        // Should be back at root
        await expect(page).toHaveURL(/\/$/);

        // Verify cookie cleared
        const cookies = await context.cookies();
        expect(cookies.every(c => c.name !== 'session-token')).toBeTruthy();

        // Verify localStorage cleared
        const last = await page.evaluate(() => localStorage.getItem('lastUsername'));
        expect(last).toBeNull();

        // Protected route now redirects again
        await page.goto('/game');
        await expect(page).toHaveURL(/\/\?returnUrl=\/game/);
    });

    test('should handle expired sessions correctly', async ({ page, context }) => {
        await authenticate(page, context);

        // Simulate expiry by clearing cookies and backdating expiry timestamp
        await context.clearCookies();
        await page.evaluate(() =>
            localStorage.setItem('tokenExpiry', (Date.now() - 1000).toString())
        );

        // Attempt protected page
        await page.goto('/game/settings');
        // Expect redirect to login with returnUrl
        await expect(page).toHaveURL(/\/\?returnUrl=\/game\/settings/);

        // Optional: check for expiry message
        const msg = page.getByText('session expired', { exact: false });
        if (await msg.isVisible()) {
            await expect(msg).toBeVisible();
        }

        // Re-authenticate
        await page.getByRole('textbox', { name: 'Name' }).fill('Emily Mueller');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should pre-populate login with last username', async ({ page, context }) => {
        await authenticate(page, context, 'Hans Xu');

        // Logout to return to login page
        await page.getByRole('button', { name: 'Logout' }).click();
        await expect(page).toHaveURL(/\/$/);

        // Input should be pre-filled
        const input = page.getByRole('textbox', { name: 'Name' });
        await expect(input).toHaveValue('Hans Xu');

        // Submit with pre-populated value
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should use previously authenticated state', async ({ browser }) => {
        // New context using saved storageState
        const context = await browser.newContext({ storageState: authFile });
        const page = await context.newPage();

        await page.goto('/game');
        await expect(page).toHaveURL(/\/game/);

        await context.close();
    });
});
