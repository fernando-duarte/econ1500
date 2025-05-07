import { z } from "zod";

/** The maximum allowable value for most economic indicators to prevent overflow/absurd scenarios. */
export const MAX_ECONOMIC_VALUE = 1e15;

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
  // Future variables to be added here for validation:
  // L: z.number().positive({ message: "Labor (L) must be a positive number." }),
  // A: z.number().positive({ message: "Technology (A) must be a positive number." }),
  // Y: z.number().nonnegative({ message: "Output (Y) cannot be negative." }),
  // X: z.number().nonnegative({ message: "Exports (X) cannot be negative." }),
  // M: z.number().nonnegative({ message: "Imports (M) cannot be negative." }),
  // NX: z.number(), // Net Exports (NX) can be negative.
  // openness: z.number().min(0).max(1, { message: "Openness must be between 0 and 1." }), // Assuming it's a ratio
  // C: z.number().nonnegative({ message: "Consumption (C) cannot be negative." }),
  // I: z.number().nonnegative({ message: "Investment (I) cannot be negative." }),
  // e: z.number().positive({ message: "Exchange Rate (e) must be a positive number." }),
  // year: z.number().int().positive({ message: "Year must be a positive integer." }),
});

/**
 * TypeScript type inferred from the economicValuesSchema.
 * This will represent the structure of the data once it has been successfully validated.
 * As the schema expands, this type will also include more properties.
 */
export type ValidatedEconomicValues = z.infer<typeof economicValuesSchema>;
