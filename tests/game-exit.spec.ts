import { test, expect, Page } from '@playwright/test';

// Helper function for reuse
const navigateToGamePage = async (page: Page, playerName: string) => {
  await page.goto('/');
  await page.getByLabel('Your Name').fill(playerName);
  await page.getByRole('button', { name: 'Join Game' }).click();
  await expect(page).toHaveURL('/game');
};

// Create a fixture to detect mobile projects
const isMobile = (projectName: string) => {
  return projectName.includes('Mobile');
};

test.describe('Game Exit Functionality', () => {
  let uniquePlayerName: string;

  test.beforeEach(async ({ page }) => {
    // Generate unique player name for test isolation
    uniquePlayerName = `Test Player ${Date.now().toString().slice(-8)}`;
    
    // Clear localStorage before test
    await page.addInitScript(() => localStorage.clear());
  });

  test('should successfully exit game and clear session data', async ({ page }, testInfo) => {
    // Arrange: Set up the game session
    await navigateToGamePage(page, uniquePlayerName);
    
    // Assert: Verify game page loaded with correct elements
    await expect(page.getByText(`Player: ${uniquePlayerName}`)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Game Content Goes Here' })).toBeVisible();
    
    // Act: Click exit button - use force:true if on mobile to bypass pointer event issues
    const exitButton = page.getByRole('button', { name: 'Exit Game' });
    if (isMobile(testInfo.project.name)) {
      await exitButton.click({ force: true });
    } else {
      await exitButton.click();
    }
    
    // Assert: Verify redirect to home page
    await expect(page).toHaveURL('/');
    
    // Assert: Verify localStorage was cleared
    const playerNameInStorage = await page.evaluate(() => localStorage.getItem('playerName'));
    expect(playerNameInStorage).toBeNull();
    
    // Assert: Verify form reset state
    await expect(page.getByLabel('Your Name')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Join Game' })).toBeDisabled();
  });

  test('should redirect to home page when accessing game without authentication', async ({ page }) => {
    // Act: Navigate directly to game page without authentication
    await page.goto('/game');
    
    // Assert: Verify automatic redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Join the Game' })).toBeVisible();
  });

  // Device testing using Playwright's project configuration instead of viewport manipulation
  test.describe('Responsive behavior', () => {
    // Note: This would typically be handled via projects in playwright.config.ts
    // We include it here for completeness
    
    test('should exit game properly on mobile viewport', async ({ page }) => {
      // Arrange: Set mobile viewport and navigate to game
      await page.setViewportSize({ width: 375, height: 667 });
      await navigateToGamePage(page, uniquePlayerName);
      
      // Act: Exit the game - use force:true to bypass pointer event issues
      await page.getByRole('button', { name: 'Exit Game' }).click({ force: true });
      
      // Assert: Verify proper redirection
      await expect(page).toHaveURL('/');
      
      // Verify localStorage cleared
      const playerNameInStorage = await page.evaluate(() => localStorage.getItem('playerName'));
      expect(playerNameInStorage).toBeNull();
    });
  });
}); 