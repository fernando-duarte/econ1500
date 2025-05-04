/**
 * Type definitions for environment variables
 * This adds IntelliSense and type checking for process.env
 */
declare namespace NodeJS {
  interface ProcessEnv {
    // Public variables (accessible in browser)
    readonly NEXT_PUBLIC_LOGIN_REDIRECT: string;
    readonly NEXT_PUBLIC_LOGOUT_REDIRECT: string;

    // Node.js environment
    readonly NODE_ENV: "development" | "production" | "test";
  }
}
