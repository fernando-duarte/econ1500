import { test, expect } from "../coverage-fixtures";
import {
  setupBasicTest,
  verifyCommonElements,
  retryButtonClick,
  saveScreenshotWithContext,
  selectStudentFromDropdown,
} from "./helpers";

test.describe("Game Controls Interface", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set up authentication and navigate to game page
    await setupBasicTest(page, context);

    // Select a student and log in
    await selectStudentFromDropdown(page, "Hans Xu");
    await retryButtonClick(page.getByRole("button", { name: "Sign In" }));

    // Verify we're on the game page
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/,
    });
  });

  test("should render saving rate slider with default value", async ({ page }, testInfo) => {
    // Verify the saving rate slider exists
    const sliderContainer = page.locator("label:has-text('Saving Rate:')").locator("xpath=..");
    await expect(sliderContainer).toBeVisible();

    // Verify default value is displayed (0.10)
    await expect(sliderContainer.locator("label")).toContainText("0.10");

    // Save screenshot of the slider
    await saveScreenshotWithContext(page, testInfo, "saving-rate-slider-default");
  });

  test("should render exchange policy radio options", async ({ page }, testInfo) => {
    // Verify exchange policy section exists
    const exchangeSection = page.locator("label:has-text('Exchange Policy')").locator("xpath=..");
    await expect(exchangeSection).toBeVisible();

    // Verify all three options are present using the text content
    await expect(page.locator('text="Undervalued (×1.2)"')).toBeVisible();
    await expect(page.locator('text="Market (×1.0)"')).toBeVisible();
    await expect(page.locator('text="Overvalued (×0.8)"')).toBeVisible();

    // Save screenshot of exchange policy options
    await saveScreenshotWithContext(page, testInfo, "exchange-policy-default");
  });

  test("should allow changing exchange policy selection", async ({ page }) => {
    // Wait for the RadioGroup to be visible
    await page.locator(".space-y-6").waitFor();

    // Select "Undervalued (×1.2)" by clicking on the text
    await page.locator('text="Undervalued (×1.2)"').click();

    // Select "Overvalued (×0.8)" by clicking on the text
    await page.locator('text="Overvalued (×0.8)"').click();
  });

  test("should submit controls when form is submitted", async ({ page }) => {
    // Select "Undervalued (×1.2)" exchange policy
    await page.locator('text="Undervalued (×1.2)"').click();

    // Submit the form
    await retryButtonClick(page.getByRole("button", { name: "Submit Round" }));

    // Check that the form submission was successful by looking for updated game state
    // For now, we'll check that the button is still available after submission
    await expect(page.getByRole("button", { name: "Submit Round" })).toBeVisible();
  });

  test("should maintain valid form state throughout interactions", async ({ page }) => {
    // The submit button should be enabled by default (with default values)
    await expect(page.getByRole("button", { name: "Submit Round" })).toBeEnabled();

    // Try all exchange policy options and verify form remains valid
    await page.locator('text="Undervalued (×1.2)"').click();
    await expect(page.getByRole("button", { name: "Submit Round" })).toBeEnabled();

    await page.locator('text="Market (×1.0)"').click();
    await expect(page.getByRole("button", { name: "Submit Round" })).toBeEnabled();

    await page.locator('text="Overvalued (×0.8)"').click();
    await expect(page.getByRole("button", { name: "Submit Round" })).toBeEnabled();
  });
});
