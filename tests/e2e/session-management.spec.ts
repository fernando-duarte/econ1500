// These types are used for type declarations in function parameters
import { test, expect } from "@playwright/test";
import {
  setupBasicTest,
  _authenticateAndVerify,
  getNameInput,
  _getLogoutButton,
  testProtectedRoute,
  _clearAppState,
  _fillAndSubmitLoginForm
} from "./helpers";

const _authFile = "playwright/.auth/user.json";

test.describe("Session Management", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupBasicTest(page, context);
  });

  test("should maintain authentication when navigating between pages", async ({
    page,
    context,
  }) => {
    // Login using helper
    await _fillAndSubmitLoginForm(page, "Aidan Wang");

    // Verify navigation to game page
    await expect(page).toHaveURL(/\/game/, { timeout: 5000 });

    // Verify cookies are set
    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === "session-token")).toBeTruthy();

    // Navigate within protected area
    await page.goto("/game/settings");
    await expect(page).toHaveURL(/\/game\/settings/, { timeout: 5000 });

    // Navigate to another protected page
    await page.goto("/game/leaderboard");
    await expect(page).toHaveURL(/\/game\/leaderboard/, { timeout: 5000 });

    // Session cookie still present
    const cookiesAfterNavigation = await context.cookies();
    expect(cookiesAfterNavigation.some((c) => c.name === "session-token")).toBeTruthy();
  });

  test("should redirect unauthenticated users to login page", async ({ page }) => {
    // Use testProtectedRoute with authentication
    await testProtectedRoute(page, "/game", "Hans Xu");
  });

  test("should update login state after logging out", async ({ page, context }) => {
    // First authenticate the user using helper
    await _authenticateAndVerify(page, context, "Aidan Wang");

    // Find and click the logout button using the helper
    const logoutButton = _getLogoutButton(page);
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();

    // Verify we're redirected back to login page
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 });
    await expect(getNameInput(page)).toBeVisible({ timeout: 5000 });

    // Session cookie should be removed
    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === "session-token")).toBeFalsy();
  });

  test("should require authentication for multiple protected routes", async ({ page }) => {
    // Array of protected routes to check
    const protectedRoutes = [
      "/game",
      "/game/settings",
      "/game/leaderboard",
    ];

    for (const route of protectedRoutes) {
      await testProtectedRoute(page, route);

      // Clear state between tests
      await _clearAppState(page, page.context());
    }
  });

  test("should maintain session across multiple browser tabs", async ({ context }) => {
    // Create and authenticate the first page/tab
    const page1 = await context.newPage();
    await setupBasicTest(page1, context);

    // Login using the helper
    await _fillAndSubmitLoginForm(page1, "Aidan Wang");

    // Verify navigation to game page
    await expect(page1).toHaveURL(/\/game/, { timeout: 5000 });

    // Open a new tab/page in the same context
    const page2 = await context.newPage();
    await page2.goto("/game/settings");

    // Verify we're still on settings page (not redirected to login)
    await expect(page2).toHaveURL(/\/game\/settings/, { timeout: 5000 });

    // Clean up
    await page1.close();
    await page2.close();
  });
});
