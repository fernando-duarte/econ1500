import { test, expect } from '@playwright/test';

test.describe('Student Selection Interface', () => {
    test.beforeEach(async ({ page, context }) => {
        // Navigate to root and clear any prior state
        await page.goto('/');
        await context.clearCookies();
        await page.evaluate(() => localStorage.clear());
    });

    test('should allow selecting a student from dropdown', async ({ page }) => {
        // Open the combobox
        const combo = page.getByRole('combobox');
        await combo.click();

        // Find and select a student option
        const option = page.getByRole('option', { name: 'Hans Xu' });
        await expect(option).toBeVisible();
        await option.click();

        // Verify input is populated and submit form
        const nameInput = page.getByRole('textbox', { name: 'Name' });
        await expect(nameInput).toHaveValue('Hans Xu');
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Verify redirect to game page
        await expect(page).toHaveURL(/\/game/);
    });

    test('should filter students when typing in search field', async ({ page }) => {
        // Open dropdown
        const combo = page.getByRole('combobox');
        await combo.click();

        // Type search text into the combo input
        await page.getByRole('textbox', { name: /search/i }).fill('Em');

        // Verify filtered results
        await expect(page.getByRole('option', { name: 'Emily Mueller' })).toBeVisible();
        await expect(page.getByRole('option', { name: 'Hans Xu' })).not.toBeVisible();
    });

    test('should populate name field when selecting from dropdown', async ({ page }) => {
        // Open dropdown and select option
        const combo = page.getByRole('combobox');
        await combo.click();
        await page.getByRole('option', { name: 'Aidan Wang' }).click();

        // Verify name field was populated
        const nameInput = page.getByRole('textbox', { name: 'Name' });
        await expect(nameInput).toHaveValue('Aidan Wang');
    });

    test('should allow manual entry without using dropdown', async ({ page }) => {
        // Enter name directly into the field
        const nameInput = page.getByRole('textbox', { name: 'Name' });
        const customName = 'Custom Student Name';
        await nameInput.fill(customName);

        // Verify value and submit
        await expect(nameInput).toHaveValue(customName);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Verify navigation to game page
        await expect(page).toHaveURL(/\/game/);

        // Check localStorage was updated with entered name
        const stored = await page.evaluate(() => localStorage.getItem('lastUsername'));
        expect(stored).toBe(customName);
    });
}); 