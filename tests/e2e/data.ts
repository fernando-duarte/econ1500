// Test data fixtures

/**
 * Returns valid and invalid student names for tests
 */
export const getTestStudents = (): {
  valid: [string, ...string[]];
  invalid: [string, ...string[]];
} => ({
  valid: ["Aidan Wang", "Hans Xu", "Emily Mueller"],
  invalid: ["Invalid@Name#", "".padEnd(101, "a")],
});

/**
 * Common error messages used in validation tests
 */
export const errorMessages = {
  invalidFormat: "Name can only contain letters, numbers, spaces, hyphens, and underscores",
  tooLong: "Name is too long",
};
