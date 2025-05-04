import { Page, Locator } from "@playwright/test";

// Curried factory for getByRole
type RoleName = Parameters<Page["getByRole"]>[0];
type RoleOpts = Parameters<Page["getByRole"]>[1];
export const byRole = (role: RoleName, opts?: RoleOpts) => (page: Page): Locator =>
    page.getByRole(role, opts);

// Curried factory for getByText
export const byText = (text: string) => (page: Page): Locator =>
    page.getByText(text);

// Specific selectors
export const getNameInput = byRole("textbox", { name: "Name" });
export const getSignInButton = byRole("button", { name: "Sign in" });
export const getCombobox = byRole("combobox");
// Locator for student option by name (page-first signature)
export const getStudentOption = (page: Page, name: string): Locator =>
    page.getByRole("option", { name });
// Locator for error message by text (page-first signature)
export const getErrorMessage = (page: Page, text: string): Locator =>
    page.getByText(text);
export const getLogoutButton = (page: Page) =>
    page.locator('[data-testid="logout-button"], button:has-text("Logout")'); 