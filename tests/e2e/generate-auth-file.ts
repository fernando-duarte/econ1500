import * as fs from "fs";
import * as path from "path";

// Use process.cwd() instead of __dirname
const rootDir = path.join(process.cwd(), "tests", "..");

/**
 * Generate authentication file with user session data
 * Uses environment variables if available, otherwise falls back to default test values
 */
export async function generateAuthFile() {
  console.log("Generating authentication file for E2E tests...");

  // Create the auth directory if it doesn't exist
  const authDir = path.join(rootDir, "playwright", ".auth");
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Get username from environment variable or use default
  const username = process.env.TEST_USERNAME || "Aidan Wang";
  console.log(`Using username: ${username}`);

  // Create the auth state file with cookie data
  const authState = {
    cookies: [
      {
        name: "session-token",
        value: username,
        domain: "localhost",
        path: "/",
        expires: -1,
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ],
    origins: [],
  };

  // Write the auth state to file
  const authFile = path.join(authDir, "user.json");
  fs.writeFileSync(authFile, JSON.stringify(authState, null, 2));

  console.log(
    `Authentication file created at playwright/.auth/user.json with username: ${username}`
  );
  return authFile;
}

// Always execute the main function when the script is run directly
// This is more reliable in npm script environments than the import.meta.url check
generateAuthFile().catch((error) => {
  console.error("Failed to generate authentication file:", error);
  process.exit(1);
});
