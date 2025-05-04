import { chromium } from "@playwright/test";
import { _authenticateAndVerify, setupBasicTest } from "./helpers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, "../..");

async function setupAuthState() {
  console.warn("Setting up authentication state for E2E tests...");

  // Create the auth directory if it doesn't exist
  const authDir = path.join(rootDir, "playwright", ".auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

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
  await _authenticateAndVerify(page, context, "Aidan Wang", {
    storeAuth: true,
    expectedRedirect: /\/game/,
  });

  // Close browser
  await browser.close();

  console.warn("Authentication state successfully created at playwright/.auth/user.json");
}

// Run the setup
setupAuthState().catch((error) => {
  console.error("Failed to set up authentication state:", error);
  process.exit(1);
});
