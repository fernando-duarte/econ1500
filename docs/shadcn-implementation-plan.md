# Migration Strategy: Full Shadcn UI Implementation

## Step-by-Step Implementation Plan

### Phase 1: Setup & Configuration

#### Step 1: Initialize Shadcn UI with CSS Variables

**Before:**
Project using standard Tailwind CSS without Shadcn UI and global styles scattered across components.

**After:**

```bash
# Backup current config
cp tailwind.config.ts tailwind.config.ts.bak
cp app/globals.css app/globals.css.bak
cp tsconfig.json tsconfig.json.bak

# Install Shadcn UI
npx shadcn@latest init
```

**Configuration in `components.json`:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**Additional Setup:**

- Mirror aliases in `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./*"],
        "@/components/*": ["components/*"]
      }
    }
  }
  ```
- Update `tailwind.config.ts` `content` array to include new UI paths:
  ```ts
  export default {
    content: ["./app/**/*.{ts,tsx}", "./components/ui/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    // ...other config
  };
  ```
- Configure PostCSS if needed:
  ```js
  // postcss.config.mjs
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
  ```
- Audit global styles for conflicts (e.g., generic `button` selectors) and refactor to ensure Shadcn UI scoped styles apply correctly.
- Use a dedicated Git branch or feature-flag for incremental rollout, allowing safe rollback if issues arise.

---

#### Step 2: Extract Current Design System

**Before:**
Tokens scattered in class strings:

```tsx
className = "rounded-lg bg-indigo-600 px-5 py-3 ...";
```

**After:**
Maintain a centralized `design-system.ts` documenting:

```ts
export const designTokens = {
  colors: { primary: { value: "indigo-600", description: "Button, links" } /* ... */ },
  radii: { button: "lg", card: "xl", input: "lg" },
  spacing: { formGap: "6", formPd: "8", btnPx: "5", btnPy: "3" },
  shadows: { card: "shadow-lg", button: "shadow-md" },
  typography: { heading: "text-3xl|font-bold", body: "text-sm|font-medium" },
};
```

**Implementation Details:**

- Audit all colors, spacing, typography; map Tailwind classes (e.g. `px-5` → `1.25rem`) alongside hex values.
- Produce visual docs: color swatches, typography specimens, component state previews.
- Verify consistency with Tailwind defaults; note any custom deviations.

---

#### Step 3: Create Theme Configuration

**Before:**

```tsx
<div className="... bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
```

**After:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: oklch(0.98 0.01 240); /* blue-50 */
  --background-end: oklch(0.95 0.03 265); /* indigo-100 */
  --foreground: oklch(0.25 0.02 265); /* indigo-900 */
  --primary: oklch(0.55 0.2 265); /* indigo-600 */
  --primary-foreground: oklch(1 0 0); /* white */
  /* ...other variables... */
  --radius: 0.75rem;
}

.dark {
  --background: oklch(0.2 0.02 265); /* gray-900 */
  --background-end: oklch(0.25 0.02 265); /* gray-800 */
  --foreground: oklch(0.98 0.01 265); /* indigo-50 */
  /* ...other dark mode variables... */
}

@layer utilities {
  .bg-gradient-page {
    @apply bg-gradient-to-b from-[var(--background)] to-[var(--background-end)];
  }
}

@layer base {
  * {
    @apply border-[var(--border)] outline-[var(--ring)]/50;
  }
  body {
    @apply bg-[var(--background)] text-[var(--foreground)];
  }
}
```

**Implementation Details:**

- Use OKLCH for improved color fidelity; convert via a tool.
- Define utility classes for gradients and shadows using CSS variables.
- Ensure `.dark` class strategy (e.g. via `next-themes`) covers SSR hydration without flicker.
- Document each variable’s Tailwind equivalent.

---

### Phase 2: Base Component Migration

#### Step 4: Add & Customize Core Shadcn UI Components

**Before:**

```tsx
<button className="rounded-lg bg-indigo-600 px-5 py-3 ...">Get Started</button>
```

**After:**

```bash
npx shadcn@latest add button input label card form toast avatar dialog dropdown-menu checkbox select tabs textarea
```

```tsx
// components/ui/button.tsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90",
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80",
        destructive:
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90",
        outline:
          "border border-[var(--input)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        link: "underline-offset-4 hover:underline text-[var(--primary)]",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-5 py-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export const Button = React.forwardRef(
  ({ variant, size, asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";
```

**Customization & Quality Checklist:**

- Adjust padding, border-radius, shadows to match design tokens.
- Preserve focus styles (`focus-visible:ring-2` etc.).
- Test each variant across states (hover, focus, active, disabled).
- Track installation & customization status in a registry (e.g., `shadcn-registry.ts`).

---

#### Step 5: Create Layout Components

**Before:** Custom containers everywhere:

```tsx
<div className="flex min-h-screen flex-col items-center">...
```

```tsx
// components/ui/container.tsx
type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
export function Container({ children, maxWidth = "xl", centered = true, className, ...props }) {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    none: "",
  };
  return (
    <div className={cn("w-full", widths[maxWidth], centered && "mx-auto", className)} {...props}>
      {children}
    </div>
  );
}

// components/ui/page-container.tsx
export function PageContainer({ children, className, ...props }) {
  return (
    <div
      className={cn("bg-gradient-page flex min-h-screen flex-col items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

**Usage:**

```tsx
<PageContainer>
  <Container maxWidth="md">...</Container>
</PageContainer>
```

**Implementation Details:**

- Limit layout components to reusable patterns.
- Provide TypeScript prop types and defaults for flexibility.
- Document usage with JSDoc and examples.
- Diagram nesting and responsibilities in architecture docs.

---

#### Step 6: Migrate Special Components (e.g., Hero)

**Before:** Custom `Hero` with unknown internals.

**After:**

```tsx
// components/hero.tsx
interface HeroProps {
  title?: string;
  description?: string;
  align?: "center" | "left" | "right";
  spacing?: "default" | "compact" | "loose";
}
export function Hero({
  title,
  description,
  align = "center",
  spacing = "default",
  children,
  className,
  ...props
}: HeroProps) {
  const alignClasses = {
    center: "text-center items-center",
    left: "text-left items-start",
    right: "text-right items-end",
  };
  const spacingClasses = { default: "py-24 gap-8", compact: "py-16 gap-6", loose: "py-32 gap-10" };
  return (
    <section
      className={cn(
        "flex w-full flex-col justify-center",
        alignClasses[align],
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {title && <h1 className="text-4xl font-extrabold lg:text-5xl">{title}</h1>}
      {description && (
        <p className="text-muted-foreground max-w-[42rem] sm:text-xl">{description}</p>
      )}
      {children}
    </section>
  );
}
```

**Implementation Details:**

- Audit existing `Hero` for props, state, layout.
- Define optional props with sensible defaults.
- Ensure backward compatibility & children patterns remain intact.
- Document with JSDoc and usage examples.

---

### Phase 3: Page Migration

#### Step 7: Migrate Home Page

**Before:**
Custom buttons, forms, layout with raw Tailwind classes.

**After:**

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Hero } from "@/components/hero";
import { PageContainer, Container } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

const formSchema = z.object({ name: z.string().min(1, { message: "Enter your name." }) });

export default function Home() {
  const { scrollToElement } = useSmoothScroll();
  const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { name: "" } });

  function onSubmit(values) {
    localStorage.setItem("playerName", values.name.trim());
    router.push("/game");
  }

  return (
    <PageContainer>
      <Hero title="Welcome to Our Game" description="Join players around the world...">
        <Button onClick={() => scrollToElement("game-form")}>Get Started</Button>
      </Hero>

      <Container maxWidth="md">
        <Card id="game-form" className="my-12">
          <CardHeader>
            <CardTitle className="text-center">Join the Game</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!form.getValues("name").trim()}>
                Join Game
              </Button>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </PageContainer>
  );
}
```

---

#### Step 8: Migrate Game Page

Follow same pattern: wrap in `PageContainer`, use Shadcn UI components, preserve functionality.

---

#### Step 9: Address Edge Cases & Testing Updates

- Replace inline scrolling with `useSmoothScroll` hook supporting offsets and top scroll.
- Update E2E tests:
  - Refactor selectors from raw classes to data-testid or component queries.
  - Add visual regression tests with Playwright.
- Maintain Storybook or MDX style guide for live component previews.

---

### Phase 4: Refinement & Optimization

#### Step 10: Perform Visual Regression Testing

1. Identify key components: Buttons, Inputs, Forms, Cards, Hero, Layouts.
2. Write screenshot tests in Playwright:
   ```ts
   test("Button visual regression", async ({ page }) => {
     /* screenshot & diff */
   });
   ```
3. Ensure diff % < 0.5. Adjust CSS variables if needed.
4. Document any intentional visual changes.

---

#### Step 11: Final Review & Documentation

- Create comprehensive design system docs (colors, typography, spacing) in Markdown.
- Publish a component usage guide with examples in README or Storybook.
- Draft migration cheatsheet showing Before/After code for Buttons, Inputs, Cards.
- Ensure docs link to Shadcn UI official site: https://ui.shadcn.com/docs
- Host Storybook or live style guide for easy team onboarding.

---

## Risk Mitigation Strategies

- **Branching & Feature Flags:** Incremental rollout behind a flag.
- **Audit & Backup:** Backup configs, audit global styles, maintain registry.
- **Testing:** Update unit/E2E tests early.
- **Documentation-First:** Write migration guides prior to coding.

---

## Implementation Timeline & Success Metrics

**Week 1:** Setup, Backup, Token Extraction, Theme Config  
**Weeks 2-3:** Base Component Migration & Layout  
**Weeks 4-5:** Page Migrations & Edge Cases  
**Week 6:** Testing, Performance, Documentation

**Metrics:**

- Visual match (≤0.5% diff)
- Bundle size ≤ baseline
- Lighthouse score ≥ previous level
- Developer onboarding time ↓ 30%
- Consistent use of tokens across 100% of new code
