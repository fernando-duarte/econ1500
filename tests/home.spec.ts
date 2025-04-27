import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should load correctly and have the correct title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check that the page has the expected title in the Hero
    await expect(page.locator('h1')).toHaveText('ECON 1500');
    
    // Check the form section title (changed from "Welcome to the Game" to "Join the Game")
    await expect(page.locator('h2')).toHaveText('Join the Game');
  });

  test('should enable button when name is entered', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Button should be disabled initially
    const button = page.getByRole('button', { name: 'Join Game' });
    await expect(button).toBeDisabled();
    
    // Enter name
    await page.getByLabel('Your Name').fill('Test Player');
    
    // Button should be enabled
    await expect(button).toBeEnabled();
  });

  test('should navigate to game page on form submission', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Fill in the form and submit
    await page.getByLabel('Your Name').fill('Test Player');
    await page.getByRole('button', { name: 'Join Game' }).click();
    
    // Should navigate to the game page
    await expect(page).toHaveURL('/game');
  });
}); 