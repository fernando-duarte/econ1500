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

## Important Tests

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

## Supplementary Tests

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
