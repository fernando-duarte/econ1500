import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// Reusable helper to perform login and save state
async function authenticate(page, context, username = 'Aidan Wang') {
    const input = page.getByRole('textbox', { name: 'Name' });
    await expect(input).toBeVisible();
    await input.fill(username);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/game/);
    await context.storageState({ path: authFile });
}

test.describe('Session Management', () => {
    test.beforeEach(async ({ page, context }) => {
        await page.goto('/');
        await context.clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    test('should maintain authentication when navigating between pages', async ({ page, context }) => {
        await authenticate(page, context);

        await page.goto('/game/settings');
        await expect(page).not.toHaveURL(/\/login/);
        await expect(page).toHaveURL(/\/game\/settings/);

        const info = page.getByTestId('user-info');
        await expect(info).toContainText('Aidan Wang');

        await page.goto('/game/leaderboard');
        await expect(page).toHaveURL(/\/game\/leaderboard/);

        const cookies = await context.cookies();
        expect(cookies.some(c => c.name === 'session-token')).toBeTruthy();
    });

    test('should redirect unauthenticated users to login page', async ({ page }) => {
        await page.goto('/game');
        await expect(page).toHaveURL(/\/login/);
        expect(page.url()).toContain('returnUrl=');

        await page.getByRole('textbox', { name: 'Name' }).fill('Hans Xu');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should clear session data on logout', async ({ page, context }) => {
        await authenticate(page, context);

        const logout = page.getByRole('button', { name: 'Logout' });
        await logout.click();
        await expect(page).toHaveURL(/\/login$/);

        const cookies = await context.cookies();
        expect(cookies.every(c => c.name !== 'session-token')).toBeTruthy();

        const last = await page.evaluate(() => localStorage.getItem('lastUsername'));
        expect(last).toBeNull();

        await page.goto('/game');
        await expect(page).toHaveURL(/\/login/);
    });

    test('should handle expired sessions correctly', async ({ page, context }) => {
        await authenticate(page, context);

        // Simulate expiry
        await context.clearCookies();
        await page.evaluate(() => localStorage.setItem('tokenExpiry', Date.now() - 1000));

        await page.goto('/game/settings');
        await expect(page).toHaveURL(/\/login/);

        // If there’s an expiry notice, verify it
        const msg = page.getByText('session expired', { exact: false });
        if (await msg.isVisible()) {
            await expect(msg).toBeVisible();
        }

        // Then re-authenticate
        await page.getByRole('textbox', { name: 'Name' }).fill('Emily Mueller');
        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should pre-populate login with last username', async ({ page, context }) => {
        await authenticate(page, context, 'Hans Xu');

        await page.getByRole('button', { name: 'Logout' }).click();
        await expect(page).toHaveURL(/\/login$/);

        const input = page.getByRole('textbox', { name: 'Name' });
        await expect(input).toHaveValue('Hans Xu');

        await page.getByRole('button', { name: 'Sign in' }).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should use previously authenticated state', async ({ browser }) => {
        const context = await browser.newContext({ storageState: authFile });
        const page = await context.newPage();

        await page.goto('/game');
        await expect(page).toHaveURL(/\/game/);

        await context.close();
    });
});
