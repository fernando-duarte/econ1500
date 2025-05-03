import { test, expect } from "@playwright/test";
import {
  getNameInput,
  getSignInButton,
  clearAppState,
  selectStudentFromDropdown,
  fillAndSubmitLoginForm,
  expectErrorMessage,
  verifySuccessfulSubmission,
  checkLocalStorage,
  checkSessionCookie,
  waitForPageLoad,
  errorMessages
} from "./helpers";

const authFile = "playwright/.auth/user.json";

// Tests that can run in parallel
test.describe.configure({ mode: 'parallel' });

test.describe("User Authentication Flow", () => {
  test.beforeEach(async ({ page, context }) => {
    // Navigate to root and clear any prior state
    await page.goto("/");
    await clearAppState(page, context);
    await waitForPageLoad(page);
  });

  test("should allow users to log in with valid name", async ({ page, context }) => {
    await test.step("Fill and submit login form", async () => {
      const testStudent = "Aidan Wang";
      await fillAndSubmitLoginForm(page, testStudent);
    });

    await test.step("Verify successful authentication", async () => {
      await verifySuccessfulSubmission(page);

      const testStudent = "Aidan Wang";
      await expect(checkLocalStorage(page, "lastUsername", testStudent)).resolves.toBe(true);
      await expect(checkSessionCookie(context)).resolves.toBe(true);

      // Persist storage state for downstream tests
      await context.storageState({ path: authFile });
    });
  });

  test("should display error when using invalid name format", async ({ page }) => {
    await test.step("Submit form with invalid data", async () => {
      const invalidName = "Invalid@Name#";
      await fillAndSubmitLoginForm(page, invalidName);
    });

    await test.step("Verify error message", async () => {
      await expectErrorMessage(page, errorMessages.invalidFormat);
      await expect(page).not.toHaveURL(/\/game/);
    });
  });

  test("should handle form submission with Enter key", async ({ page }) => {
    await test.step("Fill form and press Enter", async () => {
      const nameInput = getNameInput(page);
      const studentName = "Emily Mueller";
      await nameInput.fill(studentName);
      await nameInput.press("Enter");
    });

    await test.step("Verify successful navigation", async () => {
      await verifySuccessfulSubmission(page);
    });
  });

  test("should allow selecting a student from dropdown", async ({ page }) => {
    await test.step("Select student from dropdown", async () => {
      const studentName = "Hans Xu";
      await selectStudentFromDropdown(page, studentName);
    });

    await test.step("Submit form and verify navigation", async () => {
      await getSignInButton(page).click();
      await verifySuccessfulSubmission(page);
    });
  });

  test("should maintain authentication across sessions", async ({ browser }) => {
    await test.step("Create a new context with auth state", async () => {
      const context = await browser.newContext({ storageState: authFile });
      const page = await context.newPage();

      await page.goto("/game");
      await verifySuccessfulSubmission(page);

      await context.close();
    });
  });
});
