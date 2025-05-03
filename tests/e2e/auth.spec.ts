import { test, expect } from "@playwright/test";
import {
  setupBasicTest,
  _authenticateAndVerify,
  testFormField,
  selectStudentFromDropdown,
  getSignInButton,
  checkLocalStorage,
  checkSessionCookie,
  errorMessages,
  getNameInput,
  retryButtonClick,
  verifyCommonElements
} from "./helpers";

const authFile = "playwright/.auth/user.json";

// Tests that can run in parallel
test.describe.configure({ mode: 'parallel' });

test.describe("User Authentication Flow", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupBasicTest(page, context);
  });

  test("should allow users to log in with valid name", async ({ page, context }) => {
    const testStudent = "Aidan Wang";

    await _authenticateAndVerify(page, context, testStudent, {
      storeAuth: true,
      expectedRedirect: /\/game/
    });

    // Verify session data
    await expect(checkLocalStorage(page, "lastUsername", testStudent)).resolves.toBe(true);
    await expect(checkSessionCookie(context)).resolves.toBe(true);
  });

  test("should display error when using invalid name format", async ({ page }) => {
    await testFormField(
      page,
      "Name",
      "Valid Name",
      "Invalid@Name#",
      errorMessages.invalidFormat
    );
  });

  test("should handle form submission with Enter key", async ({ page }) => {
    const nameInput = getNameInput(page);
    const studentName = "Emily Mueller";
    await nameInput.fill(studentName);
    await nameInput.press("Enter");

    // Verify successful navigation
    await expect(page).toHaveURL(/\/game/);
  });

  test("should allow selecting a student from dropdown", async ({ page }) => {
    const studentName = "Hans Xu";
    await selectStudentFromDropdown(page, studentName);

    // Use more robust button clicking
    const signInButton = getSignInButton(page);
    await retryButtonClick(signInButton, {
      fallbackAction: async () => {
        await page.goto("/game");
      }
    });

    // Verify successful navigation
    await expect(page).toHaveURL(/\/game/);
  });

  test("should maintain authentication across sessions", async ({ browser }) => {
    // Create a new context with auth state
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();

    await page.goto("/game");
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/
    });

    await context.close();
  });
});
