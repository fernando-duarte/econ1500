import { z } from "zod";

// Regex pattern for valid student IDs
const STUDENT_ID_PATTERN = /^[sS][0-9]{1,6}$/;

export const studentSchema = z.object({
  id: z.string().regex(STUDENT_ID_PATTERN, "Invalid student ID format"),
  name: z.string().min(1, "Name is required"),
});

export type Student = z.infer<typeof studentSchema>;
