// These types are used for type declarations in function parameters
import { test, expect } from "@playwright/test";
import {
  setupBasicTest,
  getNameInput,
  testProtectedRoute,
  verifyCommonElements,
  checkSessionCookie,
  clickWhenEnabled,
  _getLogoutButton,
} from "./helpers";

test.describe("Session Management", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupBasicTest(page, context);
  });

  test("should maintain authentication when navigating between pages", async ({
    page,
    context,
  }) => {
    // Fill login form
    await getNameInput(page).fill("Aidan Wang");
    await clickWhenEnabled(page.getByRole("button", { name: "Sign in" }));

    // Verify navigation to game page and authenticated state
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/,
    });

    // Verify session cookie is set
    await expect(checkSessionCookie(context)).resolves.toBe(true);

    // Navigate within protected area
    await page.goto("/game/settings");
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game\/settings/,
    });

    // Navigate to another protected page
    await page.goto("/game/leaderboard");
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game\/leaderboard/,
    });

    // Session cookie still present
    await expect(checkSessionCookie(context)).resolves.toBe(true);
  });

  test("should redirect unauthenticated users to login page", async ({ page }) => {
    // Use testProtectedRoute with authentication
    await testProtectedRoute(page, "/game", "Hans Xu");
  });

  test("should update login state after logging out", async ({ page, context }) => {
    // Authenticate user and navigate to game page
    await getNameInput(page).fill("Aidan Wang");
    await clickWhenEnabled(page.getByRole("button", { name: "Sign in" }));

    // Verify we're authenticated and on the game page
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/,
    });

    // Find and click the logout button
    const logoutButton = _getLogoutButton(page);
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
    await logoutButton.click();

    // Verify we're logged out and on the login page
    await verifyCommonElements(page, {
      authenticated: false,
      expectedUrl: /\/$/,
    });

    // Session cookie should be removed
    await expect(checkSessionCookie(context)).resolves.toBe(false);
  });

  test("should require authentication for multiple protected routes", async ({ page }) => {
    // Array of protected routes to check
    const protectedRoutes = ["/game", "/game/settings", "/game/leaderboard"];

    for (const route of protectedRoutes) {
      await testProtectedRoute(page, route);

      // Return to login page between tests
      await page.goto("/");
    }
  });

  test("should maintain session across multiple browser tabs", async ({ context }) => {
    // Create and authenticate the first page/tab
    const page1 = await context.newPage();
    await setupBasicTest(page1, context);

    // Login on first page
    await getNameInput(page1).fill("Aidan Wang");
    await clickWhenEnabled(page1.getByRole("button", { name: "Sign in" }));

    // Verify navigation to game page
    await verifyCommonElements(page1, {
      authenticated: true,
      expectedUrl: /\/game/,
    });

    // Open a new tab/page in the same context
    const page2 = await context.newPage();
    await page2.goto("/game/settings");

    // Verify we're still authenticated on the second page
    await verifyCommonElements(page2, {
      authenticated: true,
      expectedUrl: /\/game\/settings/,
    });

    // Clean up
    await page1.close();
    await page2.close();
  });
});
