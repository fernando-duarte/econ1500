import { BrowserContext, expect, Locator, Page } from "@playwright/test";
import { getCombobox, getStudentOption } from "./selectors";

// Async pipeline helper: runs each async step in sequence
type AsyncAction<T> = (arg: T) => Promise<T>;
export const pipeAsync = <T>(...fns: Array<AsyncAction<T>>) =>
    async (initial: T): Promise<T> => {
        let result = initial;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };

/**
 * Attempts to click an element when enabled, with optional screenshot/fallback
 */
export const clickWhenEnabled = async (
    locator: Locator,
    fallbackAction?: () => Promise<void>,
    options: { timeoutMs?: number; logMessage?: string; takeScreenshot?: boolean } = {}
): Promise<void> => {
    const { timeoutMs = 2000, logMessage = "Element not enabled within timeout", takeScreenshot = false } = options;
    try {
        await expect(locator).toBeEnabled({ timeout: timeoutMs });
        await locator.click();
    } catch {
        console.warn(logMessage);
        if (takeScreenshot) {
            try {
                await locator.page().screenshot({ path: `test-results/click-timeout-${Date.now()}.png` });
            } catch { }
        }
        if (fallbackAction) {
            await fallbackAction();
        }
    }
};

/**
 * Safe stop tracing (ignores errors)
 */
export async function stopTracingSafe(context: BrowserContext, fileName: string) {
    try {
        await context.tracing.stop({ path: `test-results/traces/${fileName}.zip` });
    } catch { }
}

/**
 * Primitive actions
 */
export const openCombobox = async (page: Page): Promise<Page> => {
    await clickWhenEnabled(getCombobox(page), undefined, { logMessage: "Combobox click failed", takeScreenshot: true });
    return page;
};

/**
 * Clicks a student option after opening the combobox
 */
export const clickOption = (studentName: string) => async (page: Page): Promise<Page> => {
    const option = getStudentOption(page, studentName);
    await expect(option).toBeVisible({ timeout: 3000 });
    await option.click();
    return page;
};

/**
 * Select a student from the dropdown by opening it and clicking the option
 */
export const selectStudentFromDropdown = async (
    page: Page,
    studentName: string
): Promise<void> => {
    try {
        await openCombobox(page);
        await clickOption(studentName)(page);
    } catch (error) {
        console.error(`Student selection failed: ${String(error)}`);
        throw error;
    }
};

/**
 * Retry button click with configurable attempts and fallback
 */
export const retryButtonClick = async (
    locator: Locator,
    options?: {
        maxAttempts?: number;
        delayMs?: number;
        fallbackAction?: () => Promise<void>;
    }
): Promise<boolean> => {
    const attempts = options?.maxAttempts ?? 3;
    const delay = options?.delayMs ?? 500;

    for (let i = 0; i < attempts; i++) {
        try {
            await locator.click({ timeout: 2000 });
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.warn(`Click attempt ${i + 1}/${attempts} failed: ${errorMessage}`);
            if (i < attempts - 1) {
                await new Promise((r) => setTimeout(r, delay));
            }
        }
    }

    if (options?.fallbackAction) {
        await options.fallbackAction();
    }

    return false;
}; 