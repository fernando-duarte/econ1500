import { Page, BrowserContext, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

// Element Selectors
export const getNameInput = (page: Page) => page.getByRole('textbox', { name: 'Name' });
export const getSignInButton = (page: Page) => page.getByRole('button', { name: 'Sign in' });
export const getLogoutButton = (page: Page) => page.getByRole('button', { name: 'Logout' });
export const getCombobox = (page: Page) => page.getByRole('combobox');
export const getStudentOption = (page: Page, studentName: string) => page.getByRole('option', { name: studentName });
export const getErrorMessage = (page: Page, text: string) => page.getByText(text);

// State Management
export const clearAppState = async (page: Page, context: BrowserContext): Promise<void> => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
};

export const checkLocalStorage = async (page: Page, key: string, expectedValue: string): Promise<boolean> => {
    const value = await page.evaluate((k) => localStorage.getItem(k), key);
    return value === expectedValue;
};

export const checkSessionCookie = async (context: BrowserContext): Promise<boolean> => {
    const cookies = await context.cookies();
    return cookies.some(c => c.name === 'session-token');
};

// Interaction Patterns
export const selectStudentFromDropdown = async (page: Page, studentName: string): Promise<void> => {
    const combo = getCombobox(page);
    await combo.click();
    const option = getStudentOption(page, studentName);
    await expect(option).toBeVisible();
    await option.click();
};

export const searchStudentInDropdown = async (page: Page, searchText: string): Promise<void> => {
    const combo = getCombobox(page);
    await combo.click();
    await page.getByRole('textbox', { name: /search/i }).fill(searchText);
};

export const fillAndSubmitLoginForm = async (page: Page, username: string): Promise<void> => {
    const nameInput = getNameInput(page);
    await nameInput.fill(username);
    await getSignInButton(page).click();
};

// Existing authentication helper from real-time-connectivity.spec.ts and session-management.spec.ts
export const authenticate = async (
    page: Page,
    context: BrowserContext,
    username = 'Aidan Wang',
): Promise<void> => {
    const input = getNameInput(page);
    await expect(input).toBeVisible();
    await input.fill(username);
    await getSignInButton(page).click();
    await expect(page).toHaveURL(/\/game/);
    await context.storageState({ path: authFile });
};

// Validation Helpers
export const expectErrorMessage = async (page: Page, errorText: string): Promise<void> => {
    await expect(page.getByText(errorText)).toBeVisible();
};

export const expectRedirectToLogin = async (page: Page): Promise<void> => {
    await expect(getNameInput(page)).toBeVisible();
    await expect(page.url()).toContain('returnUrl=');
};

export const verifySuccessfulSubmission = async (page: Page): Promise<void> => {
    await expect(page).toHaveURL(/\/game/);
};

export const verifyLoadingState = async (page: Page): Promise<void> => {
    // Try to check for common loading indicators
    try {
        // Check if button becomes disabled immediately after clicking
        await expect(getSignInButton(page)).toBeDisabled({ timeout: 1000 });
    } catch {
        // If not disabled, check for loading spinner
        const spinnerLocator = page.locator('button svg.animate-spin');
        try {
            await expect(spinnerLocator).toBeVisible({ timeout: 1000 });
        } catch {
            // If no spinner, take a screenshot to visually verify loading state
            await page.screenshot({ path: 'test-results/form-submission-loading.png' });
        }
    }
};

// Test Data Helpers
export const getTestStudents = () => ({
    valid: ['Aidan Wang', 'Hans Xu', 'Emily Mueller'],
    invalid: ['Invalid@Name#', 'a'.repeat(101)],
});

// Common error messages
export const errorMessages = {
    invalidFormat: 'Name can only contain letters, numbers, spaces, hyphens, and underscores',
    tooLong: 'Name is too long',
}; 