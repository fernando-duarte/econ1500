import { test, expect } from "@playwright/test";
import {
  getNameInput,
  getSignInButton,
  // _clearAppState,
  selectStudentFromDropdown,
  // _fillAndSubmitLoginForm,
  expectErrorMessage,
  // _verifySuccessfulSubmission,
  verifyLoadingState,
  _getTestStudents,
  errorMessages,
  // _waitForPageLoad,
  clickWhenEnabled,
  setupBasicTest,
  testFormField,
  verifyCommonElements,
} from "./helpers";

// Tests that can run in parallel
test.describe.configure({ mode: "parallel" });

test.describe("Form Validation and Error Handling", () => {
  test.beforeEach(async ({ page, context }) => {
    // Use the new setupBasicTest helper
    await setupBasicTest(page, context);
  });

  test("should require name input and prevent submission of empty form", async ({ page }) => {
    // Attempt to submit the form without entering a name
    const submitBtn = getSignInButton(page);
    await expect(submitBtn).toBeDisabled();
  });

  test("should validate minimum name length", async ({ page }) => {
    await testFormField(page, "Name", "Valid Name", "A", "Name must be at least 2 characters");
  });

  test("should validate maximum name length", async ({ page }) => {
    const testData = _getTestStudents();

    await testFormField(
      page,
      "Name",
      "Valid Name",
      testData.invalid[1] || "Very long name repeated many times",
      errorMessages.tooLong
    );
  });

  test("should reject invalid name format with special characters", async ({ page }) => {
    await testFormField(
      page,
      "Name",
      "Valid Name",
      "Invalid@Name#123",
      errorMessages.invalidFormat
    );
  });

  test("should reject names with excessive whitespace", async ({ page }) => {
    await testFormField(
      page,
      "Name",
      "Valid Name",
      "   Too     Many    Spaces   ",
      "Too many spaces"
    );
  });

  test("should reject names with profanity", async ({ page }) => {
    // Note: Using a mocked profanity example that's unlikely to be flagged
    const testData = _getTestStudents();

    await testFormField(
      page,
      "Name",
      "Valid Name",
      testData.invalid[2] || "BadWord",
      "Inappropriate language"
    );
  });

  test("should show loading state during form submission", async ({ page }) => {
    // Enter a valid name
    const nameInput = getNameInput(page);
    await nameInput.fill("Aidan Wang");

    // Submit the form and check for loading state
    const submitBtn = getSignInButton(page);
    await submitBtn.click();

    // Verify loading state appears
    await verifyLoadingState(page);

    // Verify we eventually redirect to game page
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/,
    });
  });

  test("should display appropriate error message for server errors", async ({ page }) => {
    // Intercept and mock a server error response
    await page.route("**/api/auth/login", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal server error" }),
      });
    });

    // Fill and submit the form
    const nameInput = getNameInput(page);
    await nameInput.fill("Aidan Wang");
    await clickWhenEnabled(getSignInButton(page));

    // Verify error message
    await expectErrorMessage(page, "Server error occurred");

    // Verify we're still on login page
    await verifyCommonElements(page, {
      authenticated: false,
      expectedUrl: /\/$/,
    });

    // Clear mock for other tests
    await page.unroute("**/api/auth/login");
  });

  test("should validate name format when student is selected from dropdown", async ({ page }) => {
    // Select a student from dropdown with invalid name
    // This is usually not possible from the UI, but tests the validation code
    // We can mock this by:

    // 1. Select a valid student first
    await selectStudentFromDropdown(page, "Aidan Wang");

    // 2. Then manually change to an invalid name
    const nameInput = getNameInput(page);
    await nameInput.fill("Invalid@Name#");

    // 3. Submit form
    const submitBtn = getSignInButton(page);
    await clickWhenEnabled(submitBtn);

    // 4. Check error message
    await expectErrorMessage(page, errorMessages.invalidFormat);
  });
});
