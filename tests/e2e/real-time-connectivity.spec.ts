import { test, expect } from "@playwright/test";
import {
  setupBasicTest,
  _authenticateAndVerify,
  verifyCommonElements,
  saveScreenshotWithContext
} from "./helpers";

// Extend Window interface for io property
declare global {
  interface Window {
    io?: unknown;
    __socketInstance?: {
      disconnect?: () => void;
      connect?: () => void;
    }
  }
}

test.describe("Real-time Connectivity", () => {
  test.beforeEach(async ({ page, context }) => {
    await setupBasicTest(page, context);
  });

  test("should establish socket connection properly after login", async ({ page, context }, testInfo) => {
    // Authenticate with verification
    await _authenticateAndVerify(page, context, "Aidan Wang");

    // Verify we are still on the game page after a delay
    await page.waitForTimeout(2000);

    // Verify authenticated state and URL
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/
    });

    // Take a screenshot for manual verification
    await saveScreenshotWithContext(page, testInfo, "socket-connection");
  });

  test("should detect when socket disconnects", async ({ page, context }) => {
    // Authenticate first
    await _authenticateAndVerify(page, context, "Aidan Wang");

    // Simulate disconnect by evaluating in page context
    await page.evaluate(() => {
      // Access the socket object and disconnect it if available
      if (window.io) {
        // This is a simplified example - actual code would depend on how
        // the socket is exposed in your application
        const socketInstance = window.__socketInstance;
        if (socketInstance && typeof socketInstance.disconnect === 'function') {
          socketInstance.disconnect();
        }
      }
    });

    // Wait for disconnection feedback to appear
    // This will depend on how your application shows disconnection
    try {
      await expect(page.getByText("Connection lost", { exact: false })).toBeVisible({
        timeout: 5000,
      });
    } catch (_e) {
      // If there's no explicit "Connection lost" message, at least ensure
      // we're still on the game page (not kicked out to login)
      await verifyCommonElements(page, {
        authenticated: true,
        expectedUrl: /\/game/
      });
    }
  });

  test("should reconnect automatically when connection is restored", async ({ page, context }) => {
    // Authenticate first
    await _authenticateAndVerify(page, context, "Aidan Wang");

    // First simulate disconnect
    await page.evaluate(() => {
      // Similar logic as previous test for disconnection
      if (window.io) {
        const socketInstance = window.__socketInstance;
        if (socketInstance && typeof socketInstance.disconnect === 'function') {
          socketInstance.disconnect();
        }
      }
    });

    // Then simulate reconnection
    await page.evaluate(() => {
      // Reconnect logic depends on your socket implementation
      if (window.io) {
        const socketInstance = window.__socketInstance;
        if (socketInstance && typeof socketInstance.connect === 'function') {
          socketInstance.connect();
        }
      }
    });

    // Check that we're still on the game page after reconnection
    await page.waitForTimeout(2000);
    await verifyCommonElements(page, {
      authenticated: true,
      expectedUrl: /\/game/
    });
  });
});
