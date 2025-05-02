# Detailed Implementation Plan with Simulations

## Phase 1: Project Setup & Authentication

### Step 1.1: Next.js Project Initialization

**Before:**
No project structure exists.

**After:**

```
econ1500/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    ui/
  lib/
    socket/
    auth/
    schema/
  public/
  middleware.ts
  package.json
  tsconfig.json
  tailwind.config.mjs
  next.config.ts
```

**Implementation Details:**

- Include all dependencies in package.json: Socket.IO, Shadcn UI, React Hook Form, Zod
- Configure tsconfig.json with strict mode and proper path aliases
- Set up middleware.ts for route protection
- Create structured directories for socket, auth, and schema management

### Step 1.2: Shadcn UI and Tailwind Integration

**Before:**

```typescript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**After:**

```typescript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

**Implementation Details:**

- Create app/globals.css with required CSS variables for Shadcn UI
- Install tailwindcss-animate package and update plugins in package.json
- Include responsive breakpoints for mobile-first design
- Add animation keyframes for interactive UI elements

### Step 1.3: Student Data Schema

**Before:**
No student data structure exists.

**After:**

```typescript
// lib/schema/student.ts
import { z } from "zod";

// Regex pattern for valid student IDs
const STUDENT_ID_PATTERN = /^[sS][0-9]{1,6}$/;

export const studentSchema = z.object({
  id: z.string().regex(STUDENT_ID_PATTERN, "Invalid student ID format"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  section: z.string().optional(),
});

export type Student = z.infer<typeof studentSchema>;

// Utility functions for student data
export function getStudentById(students: Student[], id: string): Student | undefined {
  return students.find((student) => student.id === id);
}

export function getStudentsBySection(students: Student[], section: string): Student[] {
  return students.filter((student) => student.section === section);
}

// Mock data for development
export const mockStudents: Student[] = [
  { id: "s1", name: "Alex Johnson", section: "Section 1" },
  { id: "s2", name: "Jamie Smith", section: "Section 1" },
  { id: "s3", name: "Taylor Brown", section: "Section 2" },
  // Add more mock students
];
```

**Implementation Details:**

- Add regex pattern validation for student IDs
- Include utility functions for filtering and retrieving student data
- Include minimum length validation for required fields
- Create reusable type definition for Student
