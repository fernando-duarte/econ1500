import { Page, BrowserContext } from "@playwright/test";

/**
 * Clear application state by removing cookies and session storage
 */
export const clearAppState = async (
    page: Page,
    context: BrowserContext
): Promise<void> => {
    // Clear cookies
    await context.clearCookies();

    // Clear localStorage safely
    try {
        await page.evaluate(() => localStorage.clear());
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn("Unable to clear localStorage:", errorMessage);
    }
};

/**
 * Check if localStorage contains expected value for a key
 */
export const checkLocalStorage = async (
    page: Page,
    key: string,
    expectedValue: string
): Promise<boolean> => {
    const value = await page.evaluate((k) => localStorage.getItem(k), key);
    return value === expectedValue;
};

/**
 * Check if session cookie exists
 */
export const checkSessionCookie = async (
    context: BrowserContext
): Promise<boolean> => {
    const cookies = await context.cookies();
    return cookies.some((c) => c.name === "session-token");
}; 