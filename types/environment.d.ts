/**
 * Type definitions for environment variables
 * This adds IntelliSense and type checking for process.env
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // Authentication
    readonly AUTH_LOGIN_URL: string;
    readonly AUTH_DEFAULT_REDIRECT: string;

    // Public variables (accessible in browser)
    readonly NEXT_PUBLIC_LOGIN_REDIRECT: string;
    readonly NEXT_PUBLIC_LOGOUT_REDIRECT: string;
    readonly NEXT_PUBLIC_BASE_URL: string;

    // Node.js environment
    readonly NODE_ENV: "development" | "production" | "test";
  }
}
