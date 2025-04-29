# Updating Playwright Tests for Shadcn UI

## Overview

This document provides guidance on how to update existing Playwright tests to work with our new Shadcn UI components. The migration to Shadcn UI has changed the DOM structure and CSS classes of our components, so tests need to be updated accordingly.

## General Guidelines

1. **Use Data Attributes**: Prefer using `data-testid` attributes for targeting elements instead of relying on class names.
2. **Use Role-Based Selectors**: When appropriate, use ARIA roles and accessible attributes for more resilient tests.
3. **Check Component Structure**: Be aware that Shadcn UI components often have a different DOM structure than our previous custom components.

## Common Component Changes

### Buttons

**Before:**

```typescript
await page.click("button.rounded-lg.bg-indigo-600");
```

**After:**

```typescript
await page.click('button[type="submit"]');
// Or better:
await page.getByRole("button", { name: "Join Game" }).click();
```

### Inputs

**Before:**

```typescript
await page.fill("input#name", "Test User");
```

**After:**

```typescript
await page.fill('input[placeholder="Enter your name"]', "Test User");
// Or better:
await page.getByLabel("Your Name").fill("Test User");
```

### Cards

**Before:**

```typescript
await expect(page.locator("div.rounded-xl.bg-white")).toBeVisible();
```

**After:**

```typescript
await expect(page.getByRole("heading", { name: "Join the Game" })).toBeVisible();
```

## Testing Dark Mode

With the addition of the theme toggle functionality, make sure to test both light and dark modes:

```typescript
// Test theme toggle
await page.getByRole("button", { name: "Toggle theme" }).click();
await expect(page.locator("html")).toHaveClass(/dark/);

// Toggle back to light mode
await page.getByRole("button", { name: "Toggle theme" }).click();
await expect(page.locator("html")).not.toHaveClass(/dark/);
```

## Example: Updated Home Page Test

```typescript
import { test, expect } from "@playwright/test";

test("home page form submits correctly", async ({ page }) => {
  await page.goto("/");

  // Fill the form
  await page.getByLabel("Your Name").fill("Test User");

  // Submit form
  await page.getByRole("button", { name: "Join Game" }).click();

  // Verify redirect to game page
  await expect(page).toHaveURL(/\/game/);

  // Verify player name is displayed on game page
  await expect(page.getByTestId("player-name-display")).toContainText("Test User");
});
```

## Troubleshooting

If tests are failing after the Shadcn UI migration:

1. Use the `page.pause()` method to investigate the DOM structure at runtime
2. Check for shadow DOM or nested components that might require specialized selectors
3. Add temporary `data-testid` attributes to simplify targeting if needed
4. Use the `page.evaluate()` method to debug element presence in the browser context

## Best Practices

- Group tests by page or feature
- Create helper functions for common interactions
- Use test fixtures for common setup and teardown
- Keep tests focused on behavior, not implementation details when possible
