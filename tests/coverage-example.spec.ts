import { test, expect } from "./fixtures/coverage";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  // This test will be included in code coverage
  await expect(page).toHaveTitle(/ECON1500/i);
});
