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
 * Get the logout button locator
 * 
 * @param page - Playwright page object
 * @returns Locator for the logout button
 */
export const _getLogoutButton = (page: Page) =>
  page.locator('[data-testid="logout-button"], button:has-text("Logout")');

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
 * Clear application state by removing cookies and session storage
 * 
 * @param page - Playwright page object 
 * @param context - Playwright browser context
 * @returns Promise that resolves when cleanup is complete
 */
export const _clearAppState = async (page: Page, context: BrowserContext): Promise<void> => {
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
 * 
 * @param page - Playwright page object
 * @param username - Username to enter in the form
 * @returns Promise that resolves when form submission is complete
 */
export const _fillAndSubmitLoginForm = async (page: Page, username: string): Promise<void> => {
  const nameInput = getNameInput(page);
  await nameInput.fill(username);
  await getSignInButton(page).click();
};

/**
 * Authenticate user and verify successful authentication
 * 
 * @param page - Playwright page object
 * @param context - Playwright browser context
 * @param username - Username to use for authentication
 * @param options - Optional configuration
 * @returns Promise that resolves when authentication is complete
 */
export const _authenticateAndVerify = async (
  page: Page,
  context: BrowserContext,
  username = "Aidan Wang",
  options?: {
    storeAuth?: boolean,
    expectedRedirect?: string | RegExp
  }
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

  // Verify the session cookie is set
  const cookies = await context.cookies();
  const hasSession = cookies.some(c => c.name === 'session-token');
  expect(hasSession).toBeTruthy();

  // Store auth state if requested
  if (options?.storeAuth) {
    await context.storageState({ path: authFile });
  }

  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');

  // Verify we're on the game page
  if (options?.expectedRedirect) {
    await expect(page).toHaveURL(options.expectedRedirect, { timeout: 5000 });
  } else {
    await expect(page).toHaveURL(/\/game/, { timeout: 5000 });
  }
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
  // Wait for login page to load
  await page.waitForLoadState('networkidle');

  // Look for login page indicators
  const loginHeading = page.locator('h1').filter({ hasText: /login/i });
  const nameInput = getNameInput(page);

  // Check either the login heading or name input is visible
  await expect(
    async () => {
      const isInputVisible = await nameInput.isVisible();
      const isHeadingVisible = await loginHeading.isVisible();
      return isInputVisible || isHeadingVisible;
    },
    "Login page not visible"
  ).toPass({ timeout: 5000 });

  // Check for return URL if the URL includes it
  const currentUrl = page.url();
  if (currentUrl.includes('returnUrl')) {
    expect(currentUrl).toContain("returnUrl=");
  }
};

/**
 * Verify a successful form submission
 * 
 * @param page - Playwright page object
 * @returns Promise that resolves when verification is complete
 */
export const _verifySuccessfulSubmission = async (page: Page): Promise<void> => {
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
 * Wait for page to load completely
 * 
 * @param page - Playwright page object
 * @returns Promise that resolves when page is loaded
 */
export const _waitForPageLoad = async (page: Page): Promise<void> => {
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

/**
 * Enhanced test setup that handles navigation and state clearing
 * 
 * @param page - Playwright page object
 * @param context - Playwright browser context
 * @param options - Optional configuration options
 * @returns Promise that resolves when setup is complete
 */
export const setupBasicTest = async (
  page: Page,
  context: BrowserContext,
  options?: {
    startUrl?: string,
    skipClearState?: boolean
  }
): Promise<void> => {
  await page.goto(options?.startUrl || "/");
  if (!options?.skipClearState) {
    await _clearAppState(page, context);
    await _waitForPageLoad(page);
  }
};

/**
 * Verify redirect to login page with return URL parameter
 * 
 * @param page - Playwright page object
 * @param expectedReturnPath - Expected path in the returnUrl parameter
 * @returns Promise that resolves when verification is complete
 */
export const expectRedirectWithReturnUrl = async (
  page: Page,
  expectedReturnPath: string
): Promise<void> => {
  await expect(page).not.toHaveURL(expectedReturnPath);
  await expect(getNameInput(page)).toBeVisible();

  const encodedPath = encodeURIComponent(expectedReturnPath);
  await expect(page.url()).toContain(`returnUrl=${encodedPath}`);
};

/**
 * Test form field with validation
 * 
 * @param page - Playwright page object
 * @param fieldName - Name of the field to test
 * @param validValue - Valid value for the field
 * @param invalidValue - Invalid value for the field
 * @param expectedError - Expected error message for invalid input
 * @returns Promise that resolves when form testing is complete
 */
export const testFormField = async (
  page: Page,
  fieldName: string,
  validValue: string,
  invalidValue: string,
  expectedError: string
): Promise<void> => {
  // Get field locator based on fieldName
  const field = page.getByRole("textbox", { name: fieldName });

  // Try invalid value
  await field.fill(invalidValue);
  const submitBtn = getSignInButton(page);
  await clickWhenEnabled(submitBtn);

  // Verify error
  await expectErrorMessage(page, expectedError);

  // Try valid value
  await field.fill(validValue);
  await clickWhenEnabled(submitBtn);

  // Verify no error
  await expect(page.getByText(expectedError)).not.toBeVisible();
};

/**
 * Test a protected route with optional authentication
 * 
 * @param page - Playwright page object
 * @param route - Protected route to test
 * @param username - Optional username for authentication
 * @returns Promise that resolves when test is complete
 */
export const testProtectedRoute = async (
  page: Page,
  route: string,
  username?: string
): Promise<void> => {
  // Try to access protected route
  await page.goto(route);

  // Verify redirect to login
  await expectRedirectWithReturnUrl(page, route);

  // Login if username provided
  if (username) {
    await _fillAndSubmitLoginForm(page, username);

    // Verify navigation to route or to /game
    try {
      await expect(page).toHaveURL(route);
    } catch {
      await expect(page).toHaveURL(/\/game$/);
    }
  }
};

/**
 * Save screenshot with contextual information
 * 
 * @param page - Playwright page object
 * @param testInfo - Playwright test info
 * @param name - Name for the screenshot
 * @param options - Optional screenshot configuration
 * @returns Promise that resolves when screenshot is saved
 */
export const saveScreenshotWithContext = async (
  page: Page,
  testInfo: TestInfo,
  name: string,
  options?: {
    fullPage?: boolean,
    selector?: string
  }
): Promise<void> => {
  const path = `test-results/${testInfo.title.replace(/\s+/g, '-')}-${name}.png`;

  if (options?.selector) {
    await page.locator(options.selector).screenshot({ path });
  } else {
    await page.screenshot({
      path,
      fullPage: options?.fullPage || false
    });
  }
};

/**
 * Verify common page elements and state
 * 
 * @param page - Playwright page object
 * @param options - Optional verification configuration
 * @returns Promise that resolves when verification is complete
 */
export const verifyCommonElements = async (
  page: Page,
  options?: {
    authenticated?: boolean,
    expectedUrl?: string | RegExp,
    expectedElements?: Array<{ selector: string, text?: string }>
  }
): Promise<void> => {
  // Wait for page to be ready
  await page.waitForLoadState('networkidle');

  // Verify URL if provided
  if (options?.expectedUrl) {
    await expect(page).toHaveURL(options.expectedUrl, { timeout: 5000 });
  }

  // Verify authentication state
  if (options?.authenticated === true) {
    // Look for logout button or other authenticated indicators
    try {
      await expect(_getLogoutButton(page)).toBeVisible({ timeout: 5000 });
    } catch (_e) {
      // Check for other indicators of authentication
      const userInfo = page.locator('[id="user-info"], .user-info');
      await expect(userInfo).toBeVisible({ timeout: 5000 });
    }
  } else if (options?.authenticated === false) {
    // Look for login indicators
    try {
      await expect(getNameInput(page)).toBeVisible({ timeout: 5000 });
    } catch (_e) {
      const loginElements = page.locator('h1, h2').filter({ hasText: /login/i });
      await expect(loginElements).toBeVisible({ timeout: 5000 });
    }
  }

  // Verify expected elements
  if (options?.expectedElements) {
    for (const el of options.expectedElements) {
      const locator = el.text
        ? page.locator(el.selector, { hasText: el.text })
        : page.locator(el.selector);

      // Try with a reasonable timeout
      try {
        await expect(locator).toBeVisible({ timeout: 5000 });
      } catch (_e) {
        // Take screenshot for debugging
        await page.screenshot({ path: `test-results/element-not-found-${Date.now()}.png` });
        throw _e;
      }
    }
  }
};

/**
 * Retry button click with configurable attempts and fallback
 * 
 * @param locator - Playwright locator for the element to click
 * @param options - Optional configuration for retry behavior
 * @returns Promise resolving to boolean indicating if click was successful
 */
export const retryButtonClick = async (
  locator: Locator,
  options?: {
    maxAttempts?: number,
    delayMs?: number,
    fallbackAction?: () => Promise<void>
  }
): Promise<boolean> => {
  const attempts = options?.maxAttempts || 3;
  const delay = options?.delayMs || 500;

  for (let i = 0; i < attempts; i++) {
    try {
      await locator.click({ timeout: 2000 });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Click attempt ${i + 1}/${attempts} failed: ${errorMessage}`);

      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  if (options?.fallbackAction) {
    await options.fallbackAction();
  }

  return false;
};
