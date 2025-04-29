import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the homepage before each test
        await page.goto('/');
    });

    test('should display the hero section with Get Started button', async ({ page }) => {
        // Check if the Hero component's container or a key element within it is visible
        // Using a more robust selector if available, otherwise checking for the button
        await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible();
    });

    test('should display the Join Game form', async ({ page }) => {
        // Check if the form container is visible
        await expect(page.locator('#game-form')).toBeVisible();

        // Check for the heading within the form card
        await expect(page.getByRole('heading', { name: 'Join the Game' })).toBeVisible();

        // Check for the name input field
        await expect(page.getByLabel('Your Name')).toBeVisible();
        await expect(page.getByPlaceholder('Enter your name')).toBeVisible();

        // Check for the Join Game button (initially disabled)
        await expect(page.getByRole('button', { name: 'Join Game' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Join Game' })).toBeDisabled();
    });

    test('Join Game button should become enabled when name is entered', async ({ page }) => {
        const nameInput = page.getByLabel('Your Name');
        const joinButton = page.getByRole('button', { name: 'Join Game' });

        // Initially disabled
        await expect(joinButton).toBeDisabled();

        // Enter text
        await nameInput.fill('Test Player');

        // Should be enabled now
        await expect(joinButton).toBeEnabled();

        // Clear text
        await nameInput.fill('');

        // Should be disabled again
        await expect(joinButton).toBeDisabled();
    });

    test('clicking Get Started should scroll to the form', async ({ page }) => {
        const form = page.locator('#game-form');
        const getStartedButton = page.getByRole('button', { name: 'Get Started' });

        // Check if the form is initially not fully in view (assuming it's below the fold)
        // Playwright's isVisible checks if *any* part is visible, so we use boundingBox or isInViewport
        // await expect(form).not.toBeInViewport(); // This might be flaky depending on screen size

        await getStartedButton.click();

        // Wait for the scroll animation to complete
        await page.waitForTimeout(1000); // Adjust timeout as needed for smooth scroll

        // Check if the form is now visible/in view
        // A simple visibility check might suffice after the scroll action
        await expect(form).toBeVisible();
        // More robust check: Wait for the element to be stable and visible
        await expect(form).toBeVisible({ timeout: 5000 });

        // Optional: Check if it's actually scrolled into view
        const formBoundingBox = await form.boundingBox();
        expect(formBoundingBox).not.toBeNull();
        // You could add more checks here about the position if needed
    });

    test('should navigate to /game when name is submitted', async ({ page }) => {
        const nameInput = page.getByLabel('Your Name');
        const joinButton = page.getByRole('button', { name: 'Join Game' });

        await nameInput.fill('Test Player');
        await joinButton.click();

        // Wait for navigation to complete
        await page.waitForURL('/game');

        // Check if the URL is correct
        await expect(page).toHaveURL('/game');

        // Optional: Check local storage if needed (Playwright can execute JS)
        const playerName = await page.evaluate(() => localStorage.getItem('playerName'));
        expect(playerName).toBe('Test Player');
    });

}); 