import { z } from "zod";

/** The maximum allowable value for most economic indicators to prevent overflow/absurd scenarios. */
export const MAX_ECONOMIC_VALUE = 1e15;
/** The maximum allowable value for population (in millions) */
export const MAX_POPULATION_VALUE_MILLIONS = 10000000; // Represents 10 trillion people
/** The maximum allowable value for the openness ratio. */
export const MAX_OPENNESS_RATIO = 50; // Represents (X+M)/Y, allowing X+M to be up to 50x GDP

/**
 * Defines the validation schema for core economic variables in the game state.
 * Initially, this schema focuses on validating Capital (K), but it is intended
 * to be expanded to include other variables like Labor (L), Technology (A), etc.
 */
export const economicValuesSchema = z.object({
  K: z
    .number()
    .positive({ message: "Capital (K) must be a positive number." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Capital (K) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  L: z
    .number()
    .positive({ message: "Labor (L) must be a positive number." })
    .max(MAX_POPULATION_VALUE_MILLIONS, {
      message: `Labor (L) exceeds maximum allowed value of ${MAX_POPULATION_VALUE_MILLIONS} millions.`,
    }),
  // Future variables to be added here for validation:
  // A: z.number().positive({ message: "Technology (A) must be a positive number." }),
  Y: z
    .number()
    .nonnegative({ message: "Output (Y) cannot be negative." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Output (Y) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  X: z
    .number()
    .nonnegative({ message: "Exports (X) cannot be negative." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Exports (X) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  M: z
    .number()
    .nonnegative({ message: "Imports (M) cannot be negative." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Imports (M) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  NX: z
    .number()
    .min(-MAX_ECONOMIC_VALUE, {
      message: `Net Exports (NX) is below minimum allowed value of ${-MAX_ECONOMIC_VALUE}.`,
    })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Net Exports (NX) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }), // Net Exports (NX) can be negative.
  openness: z
    .number()
    .nonnegative({ message: "Openness must be a non-negative number." })
    .max(MAX_OPENNESS_RATIO, {
      message: `Openness exceeds maximum allowed value of ${MAX_OPENNESS_RATIO}.`,
    }),
  C: z
    .number()
    .nonnegative({ message: "Consumption (C) cannot be negative." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Consumption (C) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  I: z
    .number()
    .nonnegative({ message: "Investment (I) cannot be negative." })
    .max(MAX_ECONOMIC_VALUE, {
      message: `Investment (I) exceeds maximum allowed value of ${MAX_ECONOMIC_VALUE}.`,
    }),
  // e: z.number().positive({ message: "Exchange Rate (e) must be a positive number." }),
  // year: z.number().int().positive({ message: "Year must be a positive integer." }),
});

/**
 * TypeScript type inferred from the economicValuesSchema.
 * This will represent the structure of the data once it has been successfully validated.
 * As the schema expands, this type will also include more properties.
 */
export type ValidatedEconomicValues = z.infer<typeof economicValuesSchema>;
