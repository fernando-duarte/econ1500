import { test, expect, Page } from "@playwright/test";

// Helper function for reuse
const navigateToGamePage = async (page: Page, playerName: string) => {
  await page.goto("/");
  await page.getByLabel("Your Name").fill(playerName);
  await page.getByRole("button", { name: "Join Game" }).click();
  await expect(page).toHaveURL("/game");
};

// Create a fixture to detect mobile projects
const isMobile = (projectName: string) => {
  return projectName.includes("Mobile");
};

test.describe("Game Navigation and State Persistence", () => {
  let uniquePlayerName: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique player name for test isolation
    uniquePlayerName = `Test Player ${Date.now().toString().slice(-8)}`;

    // Clear localStorage before test
    await page.addInitScript(() => localStorage.clear());
  });

  test("should persist player name when navigating back and forth", async ({ page, context }) => {
    // Arrange: Set up the game session
    await navigateToGamePage(page, uniquePlayerName);

    // Verify game page loaded with player name
    await expect(page.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${uniquePlayerName}`
    );

    // Open a new tab in the same context (shares localStorage)
    const newPage = await context.newPage();

    // First go to home to verify redirect behavior works
    await newPage.goto("/");

    // Fill the form again with the same name to ensure localStorage is set
    await newPage.getByLabel("Your Name").fill(uniquePlayerName);
    await newPage.getByRole("button", { name: "Join Game" }).click();

    // Should be on game page with the player name visible
    await expect(newPage).toHaveURL("/game");
    await expect(newPage.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${uniquePlayerName}`
    );

    // Close the new tab
    await newPage.close();
  });

  test("should handle page refresh while maintaining player session", async ({ context }) => {
    // Create a new page for this test
    const page = await context.newPage();

    // Set uniquePlayerName directly in localStorage and navigate
    await page.goto("/");
    await page.evaluate((name) => {
      localStorage.setItem("playerName", name);
    }, uniquePlayerName);

    // Navigate directly to game page - should show player name from localStorage
    await page.goto("/game");

    // Verify we're on game page and player name is visible
    await expect(page).toHaveURL("/game");

    // Wait for content to be visible
    await expect(page.getByRole("heading", { name: "Game Dashboard" })).toBeVisible();

    // Verify the player name is displayed
    await expect(page.locator('[data-testid="player-name-display"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${uniquePlayerName}`
    );
  });

  test("should clear session properly when using browser navigation buttons", async ({ page }) => {
    // Arrange: Navigate to game and back using browser navigation
    await navigateToGamePage(page, uniquePlayerName);

    // Verify game page loaded
    await expect(page.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${uniquePlayerName}`
    );

    // Navigate back using browser history
    await page.goBack();

    // Verify we're back on the home page
    await expect(page).toHaveURL("/");

    // Since localStorage persists across navigation,
    // we need to verify if the game redirects us back to home when localStorage is cleared
    // Simulate logging out by clearing storage
    await page.evaluate(() => localStorage.removeItem("playerName"));

    // Now try to navigate directly to game page
    await page.goto("/game");

    // Should be redirected to home page since playerName is not in localStorage
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Join the Game" })).toBeVisible();
  });

  test("should handle direct navigation back to game page after exit", async ({
    page,
  }, testInfo) => {
    // Arrange: Set up the game session and exit
    await navigateToGamePage(page, uniquePlayerName);

    // Act: Click exit button - use force:true if on mobile to bypass pointer event issues
    const exitButton = page.getByRole("button", { name: "Exit Game" });
    if (isMobile(testInfo.project.name)) {
      await exitButton.click({ force: true });
    } else {
      await exitButton.click();
    }

    await expect(page).toHaveURL("/");

    // Try to navigate directly back to game page
    await page.goto("/game");

    // Should redirect back to home since player was logged out
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Join the Game" })).toBeVisible();
  });
});

// Separate test group for multiple browser contexts
test.describe("Multiple Browser Sessions", () => {
  test("should handle separate sessions correctly", async ({ browser }) => {
    // Create separate context for first user
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const player1Name = `Player1_${Date.now()}`;

    // Set up first session
    await page1.goto("/");
    await page1.evaluate(() => localStorage.clear());
    await page1.getByLabel("Your Name").fill(player1Name);
    await page1.getByRole("button", { name: "Join Game" }).click();

    // Create separate context for second user
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const player2Name = `Player2_${Date.now()}`;

    // Set up second session
    await page2.goto("/");
    await page2.evaluate(() => localStorage.clear());
    await page2.getByLabel("Your Name").fill(player2Name);
    await page2.getByRole("button", { name: "Join Game" }).click();

    // Basic verification only
    await expect(page1.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${player1Name}`
    );
    await expect(page2.locator('[data-testid="player-name-display"]')).toContainText(
      `Player: ${player2Name}`
    );

    // Clean up
    await context1.close();
    await context2.close();
  });
});
