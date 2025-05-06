import { chromium } from "@playwright/test";
import { _authenticateAndVerify, setupBasicTest } from "./helpers";
import { generateAuthFile } from "./generate-auth-file";

async function setupAuthState() {
  console.warn("Setting up authentication state for E2E tests...");

  // Generate the auth file first
  await generateAuthFile();

  // Launch browser and create a new context
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Define the base URL - use the same as in playwright.config.ts
  const baseURL = "http://localhost:3000";

  // Navigate to the login page first
  await page.goto(`${baseURL}/`);

  // Setup test and authenticate user
  await setupBasicTest(page, context, { startUrl: `${baseURL}/` });

  // Authenticate with the mock approach
  const username = process.env.TEST_USERNAME || "Aidan Wang";
  await _authenticateAndVerify(page, context, username);

  // Close browser
  await browser.close();

  console.warn("Authentication state setup complete");
}

// Run the setup
setupAuthState().catch((error) => {
  console.error("Failed to set up authentication state:", error);
  process.exit(1);
});
