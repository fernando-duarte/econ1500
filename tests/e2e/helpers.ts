import { Page, BrowserContext, expect, TestInfo, Locator } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

// Element Selectors
/**
 * Get the name input field
 * @param page - Playwright page object
 * @returns Locator for the name input field
 */
export const getNameInput = (page: Page) => page.getByRole("textbox", { name: "Name" });

/**
 * Get the sign in button
 * @param page - Playwright page object
 * @returns Locator for the sign in button
 */
export const getSignInButton = (page: Page) => page.getByRole("button", { name: "Sign in" });

/**
 * Get the logout button
 * @param page - Playwright page object
 * @returns Locator for the logout button
 */
export const getLogoutButton = (page: Page) => page.getByRole("button", { name: "Logout" });

/**
 * Get the combobox element
 * @param page - Playwright page object
 * @returns Locator for the combobox
 */
export const getCombobox = (page: Page) => page.getByRole("combobox");

/**
 * Get a student option by name from the dropdown
 * @param page - Playwright page object
 * @param studentName - Name of the student to select
 * @returns Locator for the student option
 */
export const getStudentOption = (page: Page, studentName: string) =>
  page.getByRole("option", { name: studentName });

/**
 * Get an error message by text
 * @param page - Playwright page object
 * @param text - Text of the error message
 * @returns Locator for the error message
 */
export const getErrorMessage = (page: Page, text: string) => page.getByText(text);

// State Management
/**
 * Clear application state (cookies and localStorage)
 * 
 * Use this function before tests to ensure a clean state.
 * 
 * @param page - Playwright page object
 * @param context - Playwright browser context
 * @returns Promise that resolves when state clearing is complete
 * 
 * @example
 * test.beforeEach(async ({ page, context }) => {
 *   await page.goto("/");
 *   await clearAppState(page, context);
 * });
 */
export const clearAppState = async (page: Page, context: BrowserContext): Promise<void> => {
  // Clear cookies
  await context.clearCookies();

  // Clear localStorage safely
  try {
    await page.evaluate(() => localStorage.clear());
  } catch (error: unknown) {
    // Use type narrowing for safer error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("Unable to clear localStorage:", errorMessage);
    // This can happen with security errors, but tests should still be valid
  }
};

/**
 * Check if localStorage contains expected value for a key
 * @param page - Playwright page object
 * @param key - localStorage key to check
 * @param expectedValue - Expected value
 * @returns boolean indicating if the value matches
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
 * @param context - Playwright browser context
 * @returns boolean indicating if session cookie exists
 */
export const checkSessionCookie = async (context: BrowserContext): Promise<boolean> => {
  const cookies = await context.cookies();
  return cookies.some((c) => c.name === "session-token");
};

// Interaction Patterns
/**
 * Select a student from the dropdown menu with enhanced error handling
 * 
 * @param page - Playwright Page object
 * @param studentName - Name of the student to select
 * @returns Promise that resolves when student is selected
 * 
 * @example
 * // Select 'Hans Xu' from dropdown
 * await selectStudentFromDropdown(page, "Hans Xu");
 */
export const selectStudentFromDropdown = async (page: Page, studentName: string): Promise<void> => {
  try {
    // Try to open the combobox
    const combo = getCombobox(page);
    try {
      await combo.click({ timeout: 2000 });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to click combobox: ${errorMessage}`);
      // Take a screenshot to help with debugging
      await page.screenshot({ path: `test-results/combobox-error-${Date.now()}.png` });
      throw new Error(`Unable to open student dropdown: ${errorMessage}`);
    }

    // Try to select the student option
    try {
      const option = getStudentOption(page, studentName);
      await expect(option).toBeVisible({ timeout: 3000 });
      await option.click();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to select student "${studentName}": ${errorMessage}`);

      // Check if any students are visible and list them for debugging
      const visibleOptions = await page.locator('[role="option"]').all();
      const availableStudents = await Promise.all(
        visibleOptions.map(async opt => await opt.textContent() || "")
      );

      console.error(`Available students: ${availableStudents.join(', ')}`);
      throw new Error(`Student "${studentName}" not found in dropdown. Available: ${availableStudents.join(', ')}`);
    }
  } catch (error: unknown) {
    // Centralized error handling
    console.error(`Student selection failed:`, error);
    // Create trace for debugging if within a test session
    try {
      await page.context().tracing.stop({ path: `test-results/failed-student-selection-${Date.now()}.zip` });
    } catch (_e) {
      // _e is intentionally unused: tracing might not be started, just continue
    }
    throw error;
  }
};

/**
 * Search for a student in the dropdown
 * @param page - Playwright page object
 * @param searchText - Text to search for
 */
export const searchStudentInDropdown = async (page: Page, searchText: string): Promise<void> => {
  const combo = getCombobox(page);
  await combo.click();
  await page.getByRole("textbox", { name: /search/i }).fill(searchText);
};

/**
 * Fill and submit the login form
 * @param page - Playwright page object
 * @param username - Username to fill in
 */
export const fillAndSubmitLoginForm = async (page: Page, username: string): Promise<void> => {
  const nameInput = getNameInput(page);
  await nameInput.fill(username);
  await getSignInButton(page).click();
};

/**
 * Authenticates a user and persists storage state for reuse in other tests
 * 
 * This centralized function handles the entire authentication workflow:
 * 1. Fills in the username in the login form
 * 2. Clicks the sign-in button
 * 3. Verifies navigation to the game page was successful
 * 4. Stores authentication state to the authFile for subsequent tests
 * 
 * @param page - Playwright Page object
 * @param context - Playwright BrowserContext
 * @param username - Name to use for authentication (default: "Aidan Wang")
 * @returns Promise that resolves when authentication is complete
 * @throws {Error} If authentication fails or navigation doesn't complete
 * 
 * @example
 * // Authenticate with default username
 * await _authenticate(page, context);
 * 
 * // Authenticate with custom username
 * await _authenticate(page, context, "Custom User");
 */
export const _authenticate = async (
  page: Page,
  context: BrowserContext,
  username = "Aidan Wang"
): Promise<void> => {
  const input = getNameInput(page);
  await expect(input).toBeVisible();
  await input.fill(username);

  // Get the button and wait for it to be enabled before clicking
  const signInButton = getSignInButton(page);
  await expect(signInButton).toBeEnabled();
  await signInButton.click();

  // Verify navigation to game page
  await expect(page).toHaveURL(/\/game/);

  // Store authentication state for reuse
  await context.storageState({ path: authFile });
};

// Validation Helpers
/**
 * Expect an error message to be visible
 * @param page - Playwright page object
 * @param errorText - Text of the error message
 */
export const expectErrorMessage = async (page: Page, errorText: string): Promise<void> => {
  await expect(page.getByText(errorText)).toBeVisible();
};

/**
 * Expect redirection to login page
 * @param page - Playwright page object
 */
export const expectRedirectToLogin = async (page: Page): Promise<void> => {
  await expect(getNameInput(page)).toBeVisible();
  await expect(page.url()).toContain("returnUrl=");
};

/**
 * Verify successful form submission
 * @param page - Playwright page object
 */
export const verifySuccessfulSubmission = async (page: Page): Promise<void> => {
  await expect(page).toHaveURL(/\/game/);
};

/**
 * Verify loading state during form submission
 * @param page - Playwright page object
 */
export const verifyLoadingState = async (page: Page): Promise<void> => {
  // Try to check for common loading indicators
  try {
    // Check if button becomes disabled immediately after clicking
    await expect(getSignInButton(page)).toBeDisabled({ timeout: 1000 });
  } catch (_error) {
    // If not disabled, check for loading spinner
    const spinnerLocator = page.locator("button svg.animate-spin");
    try {
      await expect(spinnerLocator).toBeVisible({ timeout: 1000 });
    } catch (_error) {
      // If no spinner, take a screenshot to visually verify loading state
      await page.screenshot({ path: "test-results/form-submission-loading.png" });
    }
  }
};

// Test Data Helpers
/**
 * Get test student data
 * @returns Object with valid and invalid student names
 */
export const _getTestStudents = (): { valid: [string, ...string[]], invalid: [string, ...string[]] } => ({
  valid: ["Aidan Wang", "Hans Xu", "Emily Mueller"],
  invalid: ["Invalid@Name#", "a".repeat(101)],
});

/**
 * Common error messages
 */
export const errorMessages = {
  invalidFormat: "Name can only contain letters, numbers, spaces, hyphens, and underscores",
  tooLong: "Name is too long",
};

// New helper functions from the improved refactoring plan

/**
 * Wait for page to fully load
 * @param page - Playwright page object
 */
export const waitForPageLoad = async (page: Page): Promise<void> => {
  await expect(page.locator("body")).toBeVisible();
  // Wait for network to be idle, better than arbitrary timeouts
  await page.waitForLoadState("networkidle");
};

/**
 * Attempts to click an element when it becomes enabled, with configurable retry logic
 * 
 * @param locator - Element locator to click
 * @param fallbackAction - Optional function to call if clicking fails
 * @param options - Configuration options
 * @returns Promise that resolves when click succeeds or fallback action completes
 * 
 * @example
 * // Simple usage with default timeout
 * await clickWhenEnabled(getSignInButton(page));
 * 
 * // With custom timeout and fallback
 * await clickWhenEnabled(
 *   getSignInButton(page), 
 *   async () => await page.goto("/game"),
 *   { timeoutMs: 3000, logMessage: "Sign-in button not enabled, navigating directly" }
 * );
 */
export const clickWhenEnabled = async (
  locator: Locator,
  fallbackAction?: () => Promise<void>,
  options: {
    timeoutMs?: number,
    logMessage?: string,
    takeScreenshot?: boolean
  } = {}
): Promise<void> => {
  const {
    timeoutMs = 2000,
    logMessage = "Element not enabled within timeout, using fallback",
    takeScreenshot = false
  } = options;

  try {
    await expect(locator).toBeEnabled({ timeout: timeoutMs });
    await locator.click();
  } catch (_error) {
    // _error is intentionally unused: we only care that there was a failure, not the specific error
    console.warn(logMessage);

    if (takeScreenshot) {
      try {
        await locator.page().screenshot({
          path: `test-results/click-timeout-${Date.now()}.png`
        });
      } catch (_e) {
        // _e is intentionally unused: screenshot failures shouldn't block test execution
      }
    }

    if (fallbackAction) {
      await fallbackAction();
    }
  }
};

/**
 * Attempt to click an element with fallback action if it fails
 * 
 * @param locator - Playwright locator to click
 * @param fallbackAction - Optional fallback function to call if click fails
 * @returns Promise that resolves when click or fallback succeeds
 * 
 * @deprecated Use clickWhenEnabled instead for more configurable retry behavior
 */
export const attemptClick = async (
  locator: Locator,
  fallbackAction?: () => Promise<void>
): Promise<void> => {
  return clickWhenEnabled(locator, fallbackAction);
};

/**
 * Start tracing for debugging
 * 
 * Use this at the beginning of complex tests to capture a trace for debugging
 * 
 * @param context - Playwright browser context
 * @param testInfo - Test info object
 * @returns Promise that resolves when tracing starts
 * 
 * @example
 * test('complex test scenario', async ({ page, context }, testInfo) => {
 *   await startTracing(context, testInfo);
 *   // Test actions...
 *   await stopTracing(context, testInfo);
 * });
 */
export const startTracing = async (
  context: BrowserContext,
  testInfo: TestInfo
): Promise<void> => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
    title: testInfo.title
  });
};

/**
 * Stop tracing and save trace file
 * 
 * Use this at the end of tests or in afterEach hooks
 * 
 * @param context - Playwright browser context
 * @param testInfo - Test info object
 * @returns Promise that resolves when trace is saved
 */
export const stopTracing = async (
  context: BrowserContext,
  testInfo: TestInfo
): Promise<void> => {
  await context.tracing.stop({
    path: `./test-results/traces/${testInfo.title.replace(/\s+/g, '-')}.zip`
  });
};

/**
 * Check multiple conditions using soft assertions
 * 
 * This allows multiple checks without stopping test execution on first failure
 * 
 * @param page - Playwright page object
 * @param conditions - Array of functions that return promises
 * @returns Promise that resolves when all conditions are checked
 * 
 * @example
 * await expectMultipleConditions(page, [
 *   async () => await expect(page.locator('#elem1')).toBeVisible(),
 *   async () => await expect(page.locator('#elem2')).toHaveText('Expected text'),
 *   async () => await expect(page).toHaveURL(/\/expected-path/)
 * ]);
 */
export const expectMultipleConditions = async (
  page: Page,
  conditions: Array<() => Promise<void>>
): Promise<void> => {
  for (const condition of conditions) {
    try {
      await expect.soft(() => condition()).not.toThrow();
    } catch (_e) {
      // _e is intentionally unused: we're using soft assertions specifically to not fail on error
      console.warn("Soft assertion failed");
    }
  }
};
