import { test, expect } from '@playwright/test';
import { getNameInput, getSignInButton, getCombobox, getStudentOption } from './helpers';

const authFile = 'playwright/.auth/user.json';

test.describe('User Authentication Flow', () => {
    test.beforeEach(async ({ page, context }) => {
        // Navigate to root and clear any prior state
        await page.goto('/');
        await context.clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    test('should allow users to log in with valid name', async ({ page, context }) => {
        const nameInput = getNameInput(page);
        await expect(nameInput).toBeVisible();
        const testStudent = 'Aidan Wang';

        await nameInput.fill(testStudent);
        await getSignInButton(page).click();
        await expect(page).toHaveURL(/\/game/);

        const stored = await page.evaluate(() => localStorage.getItem('lastUsername'));
        expect(stored).toBe(testStudent);

        const cookies = await context.cookies();
        expect(cookies.some(c => c.name === 'session-token')).toBeTruthy();

        // Persist storage state for downstream tests
        await context.storageState({ path: authFile });
    });

    test('should display error when using invalid name format', async ({ page }) => {
        const nameInput = getNameInput(page);
        const submit = getSignInButton(page);

        await nameInput.fill('Invalid@Name#');
        await submit.click();

        await expect(
            page.getByText(
                'Name can only contain letters, numbers, spaces, hyphens, and underscores'
            )
        ).toBeVisible();
        await expect(page).not.toHaveURL(/\/game/);
    });

    test('should handle form submission with Enter key', async ({ page }) => {
        const nameInput = getNameInput(page);
        await nameInput.fill('Emily Mueller');
        // Pressing Enter on the input will trigger form submission
        await nameInput.press('Enter');

        await expect(page).toHaveURL(/\/game/);
    });

    test('should allow selecting a student from dropdown', async ({ page }) => {
        // Open the combobox and select 'Hans Xu'
        const combo = getCombobox(page);
        await combo.click();
        const option = getStudentOption(page, 'Hans Xu');
        await expect(option).toBeVisible();
        await option.click();

        await getSignInButton(page).click();
        await expect(page).toHaveURL(/\/game/);
    });

    test('should maintain authentication across sessions', async ({ browser }) => {
        const context = await browser.newContext({ storageState: authFile });
        const page = await context.newPage();

        await page.goto('/game');
        await expect(page).toHaveURL(/\/game/);

        await context.close();
    });
});
