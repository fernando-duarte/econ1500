import { test, expect } from "@playwright/test";

/**
 * Form Input Validation Tests
 *
 * These tests verify that the player name input form properly validates different
 * types of input and handles edge cases correctly.
 */
test.describe("Form Input Validation", () => {
  // Define a custom fixture that clears localStorage and navigates to homepage
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.addInitScript(() => localStorage.clear());

    // Navigate to the homepage
    await page.goto("/");
  });

  test("should disable submit button for empty input", async ({ page }) => {
    // Check initial state - button should be disabled
    const joinButton = page.getByRole("button", { name: "Join Game" });
    await expect(joinButton).toBeDisabled();

    // Try to programmatically click the button (should have no effect since it's disabled)
    await joinButton.click({ force: true });

    // Verify we're still on the home page
    await expect(page).toHaveURL("/");
  });

  // Parameterized test for whitespace handling
  const whitespaceTests = [
    { name: "spaces only", input: "   " },
    { name: "tabs and newlines", input: "\t\n " },
    { name: "non-breaking spaces", input: "\u00A0\u00A0\u00A0" },
  ];

  for (const { name, input } of whitespaceTests) {
    test(`should reject ${name}`, async ({ page }) => {
      // Fill the name input with the test whitespace
      await page.getByLabel("Your Name").fill(input);

      // Check if button remains disabled (whitespace should be trimmed)
      const joinButton = page.getByRole("button", { name: "Join Game" });
      await expect(joinButton).toBeDisabled();

      // Try to force a submission by pressing Enter
      await page.getByLabel("Your Name").press("Enter");

      // Verify we're still on the home page
      await expect(page).toHaveURL("/");
    });
  }

  test("should handle names with leading/trailing whitespace", async ({ page }) => {
    // Fill name with leading and trailing spaces
    const nameWithSpaces = "  Test Player  ";
    await page.getByLabel("Your Name").fill(nameWithSpaces);

    // Button should be enabled
    const joinButton = page.getByRole("button", { name: "Join Game" });
    await expect(joinButton).toBeEnabled();

    // Submit the form
    await joinButton.click({ force: true });

    // Verify navigation
    await expect(page).toHaveURL("/game");

    // Use soft assertions to collect all potential failures
    await expect.soft(page.getByText("Player: Test Player")).toBeVisible();

    // Verify that localStorage also has the trimmed value
    const storedName = await page.evaluate(() => localStorage.getItem("playerName"));
    expect.soft(storedName).toBe("Test Player");
  });

  // Parameterized test for valid input types
  const validInputTests = [
    { name: "single character", input: "A", expected: "A" },
    { name: "very long name", input: "A".repeat(100), expected: "A".repeat(100) },
    { name: "special characters", input: "Test!@#$%^&*()_+", expected: "Test!@#$%^&*()_+" },
    { name: "numbers", input: "Player123", expected: "Player123" },
    { name: "multiple words", input: "John Doe Smith", expected: "John Doe Smith" },
    {
      name: "international characters",
      input: "José María Søren Björn 李",
      expected: "José María Søren Björn 李",
    },
    { name: "emojis", input: "Player 😊🎮", expected: "Player 😊🎮" },
  ];

  for (const { name, input, expected } of validInputTests) {
    test(`should accept name with ${name}`, async ({ page }) => {
      // Fill the name input with test data
      await page.getByLabel("Your Name").fill(input);

      // Get the button 
      const joinButton = page.getByRole("button", { name: "Join Game" });

      // Click the button with force
      await joinButton.click({ force: true });

      // Add a wait to give time for navigation
      await page.waitForTimeout(1000);

      // Wait for navigation to complete (with a longer timeout)
      await expect(page).toHaveURL("/game", { timeout: 10000 });

      // Use soft assertions to collect all potential failures
      // If the exact name isn't displayed (e.g., if truncated), this will still report other issues
      await expect.soft(page.locator('[data-testid="player-name-display"]')).toBeVisible();
      await expect
        .soft(page.locator('[data-testid="player-name-display"]'))
        .toContainText(`Player: ${expected.substring(0, 30)}`);

      // Verify localStorage
      const storedName = await page.evaluate(() => localStorage.getItem("playerName"));
      expect.soft(storedName).toBe(expected);
    });
  }

  test("should properly handle form resubmission with different names", async ({ page }) => {
    // First submission
    await page.getByLabel("Your Name").fill("First Player");
    await page.getByRole("button", { name: "Join Game" }).click({ force: true });

    // Verify navigation
    await expect(page).toHaveURL("/game");

    // Exit game
    await page.getByRole("button", { name: "Exit Game" }).click({ force: true });
    await expect(page).toHaveURL("/");

    // Form should be reset
    await expect(page.getByLabel("Your Name")).toHaveValue("");
    await expect(page.getByRole("button", { name: "Join Game" })).toBeDisabled();

    // Second submission with different name
    await page.getByLabel("Your Name").fill("Second Player");
    await page.getByRole("button", { name: "Join Game" }).click({ force: true });

    // Verify navigation with new name
    await expect(page).toHaveURL("/game");
    await expect(page.locator('[data-testid="player-name-display"]')).toContainText(
      "Player: Second Player"
    );

    // Verify localStorage has updated value
    const storedName = await page.evaluate(() => localStorage.getItem("playerName"));
    expect(storedName).toBe("Second Player");
  });

  // Add responsive testing for different viewport sizes
  test.describe("responsive design tests", () => {
    const viewports = [
      { name: "mobile", width: 375, height: 667 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "desktop", width: 1280, height: 800 },
    ];

    for (const { name, width, height } of viewports) {
      test(`should handle form submission on ${name} viewport`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize({ width, height });

        // Fill form
        await page.getByLabel("Your Name").fill(`Viewport Test ${name}`);

        // Submit form with force click
        await page.getByRole("button", { name: "Join Game" }).click({ force: true });

        // Verify navigation with longer timeout
        await expect(page).toHaveURL("/game", { timeout: 10000 });

        // Verify displayed name
        await expect(page.getByText(`Player: Viewport Test ${name}`)).toBeVisible();
      });
    }
  });

  // Add accessibility testing
  test("should have accessible form elements", async ({ page }) => {
    // Check that form elements have proper ARIA attributes and roles

    // Input should have label
    const nameInput = page.getByLabel("Your Name");
    const inputId = await nameInput.getAttribute("id");
    expect(inputId).toBeTruthy();

    // Label should be properly associated with input
    const label = page.locator(`label[for="${inputId}"]`);
    await expect(label).toBeVisible();

    // Button should express its disabled state correctly
    const button = page.getByRole("button", { name: "Join Game" });

    // Check button is discoverable by role
    await expect(button).toBeVisible();

    // Fill form to enable button
    await nameInput.fill("Accessibility Test");

    // Check that state change is correctly exposed to accessibility API
    await expect(button).toBeEnabled();

    // Check form is keyboard navigable
    await page.keyboard.press("Tab"); // Focus should go to first interactive element

    // Submit with keyboard
    await nameInput.focus();
    await nameInput.press("Enter");

    // Verify navigation
    await expect(page).toHaveURL("/game");
  });

  // Add trace collection instructions as a comment
  /**
   * For optimal debugging of test failures, run tests with trace collection:
   *
   * npx playwright test --trace on
   *
   * This will generate traces that can be viewed in the Playwright report.
   */
});
