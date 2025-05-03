# End-to-End Tests for ECON1500: The China Growth Game

This document outlines a comprehensive end-to-end testing strategy for the ECON1500 application, prioritized from most critical to least critical.

## Critical Tests

### 1. User Authentication Flow

- Verify that users can log in with their name
- Confirm that validation prevents invalid name formats
- Ensure login failures are properly displayed
- Check that successful login redirects to the game page

### 2. Session Management

- Verify that authenticated users remain logged in when navigating between pages
- Ensure users are correctly redirected to the login page when accessing protected routes without authentication
- Test that the logout functionality works correctly and clears session data
- Verify that session expiry works as expected after the designated time period

### 3. Game Access Protection

- Confirm that unauthenticated users cannot access the game page directly
- Verify that authentication middleware redirects unauthorized users to the login page
- Test that the login redirect preserves the original destination URL

### 4. Student Selection Interface

- Verify the student search and selection dropdown works correctly
- Test that selecting a student from the dropdown correctly populates the username field
- Ensure the manual entry option works alongside the dropdown selection

### 5. Real-time Connectivity

- Verify that socket connections are established properly after login
- Test socket reconnection functionality when connection is temporarily lost
- Confirm that socket authentication works correctly with user credentials
- Verify error handling when socket connection fails

### 6. Browser Storage

- Test that the application correctly stores and retrieves the last username from local storage
- Verify that session data persists correctly across page refreshes
- Confirm that logging out removes all relevant stored data

### 7. Accessibility Testing

- Verify that keyboard navigation works throughout the application
- Test that screen readers can properly announce form elements and error messages
- Confirm that "skip to content" links function correctly
- Ensure all interactive elements have appropriate focus states

### 8. Form Validation and Error Handling

- Test form validation for all input fields
- Verify that error messages are clear and descriptive
- Test form submission with both valid and invalid data
- Confirm that the UI properly indicates loading states during form submission

### 9. Responsive Design

- Verify that the application displays correctly on various screen sizes
- Test that the login interface is usable on mobile devices
- Confirm that the game interface adapts appropriately to different viewports

### 10. Cross-browser Compatibility

- Test the application in major browsers (Chrome, Firefox, Safari, Edge)
- Verify that all functionality works consistently across browsers
- Confirm that the application appearance is consistent between browsers

## Best Practices for E2E Testing with shadcn/ui

### 1. Use Semantic Locators

- Target components by their semantic roles and accessible attributes instead of class names or CSS selectors
- Use `getByRole`, `getByLabel`, and `getByText` in Playwright to find elements
- Example: `page.getByRole("button", { name: "Submit" })` instead of `.class-selector`

### 2. Test Component Behavior, Not Implementation

- Focus on testing user-visible behavior rather than internal implementation details
- Test interactions from a user's perspective (clicks, form filling, navigation)
- Verify expected outcomes rather than internal state changes

### 3. Leverage ARIA Attributes

- shadcn/ui components have built-in accessibility via Radix UI primitives
- Use these attributes in your tests to locate elements reliably
- Example: For a dropdown, use `getByRole("combobox")` to find the select element

### 4. Test Common User Flows

- Form submissions (with validation)
- Button interactions (disabled states, loading states)
- Dropdown/select interactions (opening, selecting options)
- Modal/dialog interactions (opening, closing, form submission)

### 5. Test Accessibility

- Verify keyboard navigation works properly (tab order, focus states)
- Test screen reader compatibility by checking ARIA roles and attributes
- Verify that error messages are properly associated with form fields

### 6. Test Component States

- Test both default and interactive states (hover, focus, active)
- Test loading states and error states
- For form components, test validation states (error, success)

### 7. Set Up Isolated Test Environments

- Use Playwright's context isolation to avoid test interdependencies
- Reset application state between tests
- Mock API responses for predictable test behavior

### 8. Simulate User Interactions Accurately

- Use proper events (click, type, press) instead of directly setting values
- Wait for animations to complete where necessary (shadcn/ui has transitions)
- Use `await expect(element).toBeVisible()` before interacting with elements

### 9. Test Dark Mode Compatibility

- Test components in both light and dark mode
- Verify color contrast meets accessibility standards in both modes
- Check that state indicators (focus, hover) work properly in both modes

### 10. Create Reusable Test Helpers

- Create helper functions for common operations like login, form filling
- Use Playwright's custom fixtures for repeatable setup
- Consider page object models for complex interfaces

## Prompt

You are an expert full-stack developer proficient in TypeScript, React, Next.js, and modern UI/UX frameworks (e.g., Tailwind CSS, Shadcn UI, Radix UI). Your task is to produce the most optimized and maintainable Next.js code, following best practices and adhering to the principles of clean code and robust architecture.

now let's work on ### 5 test-plan.md.

use context7 and exa to validate syntax and best practices.
stay within shadcn/ui components and design and infrastructure as much as possible, don't use other things when you can use shadcn/ui or do it "the shadcn/ui way"
rely heavily on the already working tests @e2e for structure, syntax, debugging, connection to the codebase.

your current task:

write the test in ### 5

- Verify that socket connections are established properly after login

do not implement yet, just write the proposal for the code.

Steps:

1. write proposed code.
2. after writing proposal, check with context7 and exa to validate the code and implement best practices
3. then check syntax against functioning syntax in files in @e2e , and correct if needed to known functioning syntax.
4. run the test
5. debug until it passes.
6. commit and push
