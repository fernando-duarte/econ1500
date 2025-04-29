# Design System Documentation

## Color System

Our design system uses a semantic color approach with CSS variables, allowing for easy theming and dark mode support.

### Base Colors

| Variable                   | Light Mode              | Dark Mode              | Usage                            |
| -------------------------- | ----------------------- | ---------------------- | -------------------------------- |
| `--background`             | #F57C00 (warm orange)   | #212121 (almost-black) | Page backgrounds                 |
| `--foreground`             | #3E2723 (dark brown)    | #FFF8E1 (soft cream)   | Primary text color               |
| `--primary`                | #FFEB3B (bright yellow) | #FFC107 (amber)        | Primary actions, buttons, links  |
| `--primary-foreground`     | #3E2723 (dark brown)    | #212121 (almost-black) | Text on primary elements         |
| `--secondary`              | #8CAA7E (muted green)   | #8CAA7E (muted green)  | Secondary UI elements            |
| `--secondary-foreground`   | #FFFFFF (white)         | #212121 (almost-black) | Text on secondary elements       |
| `--muted`                  | #E65100 (deep orange)   | #37474F (blue-grey)    | Subdued UI elements              |
| `--muted-foreground`       | #FFFFFF (white)         | #B0BEC5 (light grey)   | Text on muted elements           |
| `--accent`                 | #D32F2F (flag-red)      | #D32F2F (flag-red)     | Accent UI elements, highlighting |
| `--accent-foreground`      | #FFFFFF (white)         | #FFF8E1 (soft cream)   | Text on accent elements          |
| `--border`                 | #FFB74D (light amber)   | #616161 (mid-grey)     | Borders, dividers                |
| `--card`                   | #FFFFFF (white)         | #1E1E1E (dark grey)    | Card backgrounds                 |
| `--card-foreground`        | Same as foreground      | Same as foreground     | Text on cards                    |
| `--destructive`            | #EF4444 (red)           | #F43F5E (pink-red)     | Destructive actions              |
| `--destructive-foreground` | #FFFFFF (white)         | #FFF8E1 (soft cream)   | Text on destructive elements     |
| `--input`                  | Same as border          | Same as border         | Form input borders               |
| `--ring`                   | Same as primary         | Same as primary        | Focus rings                      |

### Interactive States

| Variable                | Value   | Usage                                      |
| ----------------------- | ------- | ------------------------------------------ |
| `--hover-light`         | #FFB74D | Hover state for light backgrounds          |
| `--hover-dark`          | #E65100 | Hover state for dark backgrounds           |
| `--hover-primary-dark`  | #FBC02D | Hover state for primary elements (darker)  |
| `--hover-primary-light` | #FFF176 | Hover state for primary elements (lighter) |

## Typography

Our typography system uses the Geist Sans and Geist Mono fonts with a set of utility classes for consistent text styles.

### Font Families

| Variable      | Value      | Usage                           |
| ------------- | ---------- | ------------------------------- |
| `--font-sans` | Geist Sans | Primary font for UI and content |
| `--font-mono` | Geist Mono | Monospace font for code blocks  |

### Font Sizes

Follow Tailwind's default text size scale:

| Class       | Size     | Usage                        |
| ----------- | -------- | ---------------------------- |
| `text-xs`   | 0.75rem  | Very small text, footnotes   |
| `text-sm`   | 0.875rem | Small text, captions, labels |
| `text-base` | 1rem     | Body text                    |
| `text-lg`   | 1.125rem | Large body text              |
| `text-xl`   | 1.25rem  | Subtitles                    |
| `text-2xl`  | 1.5rem   | Headings                     |
| `text-3xl`  | 1.875rem | Large headings               |
| `text-4xl`  | 2.25rem  | Extra large headings         |
| `text-5xl`  | 3rem     | Display headings             |
| `text-6xl`  | 3.75rem  | Hero headings                |

### Font Weights

| Class            | Weight | Usage                   |
| ---------------- | ------ | ----------------------- |
| `font-light`     | 300    | Light text              |
| `font-normal`    | 400    | Normal body text        |
| `font-medium`    | 500    | Medium emphasis         |
| `font-semibold`  | 600    | Semibold headings       |
| `font-bold`      | 700    | Bold headings, emphasis |
| `font-extrabold` | 800    | Extra bold display text |

## Spacing System

We follow Tailwind's default spacing scale. Key spacings used throughout the interface:

| Class   | Rem     | Pixels | Usage                          |
| ------- | ------- | ------ | ------------------------------ |
| `p-2`   | 0.5rem  | 8px    | Tight internal padding         |
| `p-3`   | 0.75rem | 12px   | Default button padding         |
| `p-4`   | 1rem    | 16px   | Standard content padding       |
| `p-6`   | 1.5rem  | 24px   | Card padding                   |
| `p-8`   | 2rem    | 32px   | Section padding                |
| `p-12`  | 3rem    | 48px   | Large section padding          |
| `gap-2` | 0.5rem  | 8px    | Tight spacing between items    |
| `gap-4` | 1rem    | 16px   | Standard spacing between items |
| `gap-6` | 1.5rem  | 24px   | Loose spacing between items    |

## Border Radius

We use a consistent border radius scale with a base variable:

| Variable/Class | Value                        | Usage                       |
| -------------- | ---------------------------- | --------------------------- |
| `--radius`     | 0.75rem                      | Base radius value           |
| `rounded-lg`   | border-radius: var(--radius) | Default component radius    |
| `rounded-full` | border-radius: 9999px        | Pills, avatars, circular UI |

## Components

### Button

```jsx
<Button>Default Button</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

#### Button Sizes

```jsx
<Button size="default">Default Size</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Input

```jsx
<Input placeholder="Default input" />
<Input disabled placeholder="Disabled input" />
```

### Card

```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <p>Card footer</p>
  </CardFooter>
</Card>
```

### Form Components

```jsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="example"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Form Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Helper text</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Layout Components

```jsx
<PageContainer>
  {/* Full-width page container with gradient background */}
  <Container maxWidth="md">{/* Content container with max-width */}</Container>
</PageContainer>
```

## Best Practices

1. **Component Consistency**: Always use the pre-built components instead of creating custom ones
2. **Theme Variables**: Use semantic color variables (e.g., `bg-primary`) instead of literal colors
3. **Accessibility**: Ensure proper contrast ratios between background and text colors
4. **Responsive Design**: Use breakpoint classes (`sm:`, `md:`, `lg:`) for responsive layouts
5. **Dark Mode**: Test all interfaces in both light and dark modes
6. **Class Merging**: Use the `cn()` utility to merge class names and handle conditionals

## Using the `cn()` Utility

```jsx
import { cn } from "@/lib/utils";

// Basic class merge
<div className={cn("base-class", className)} />;

// Conditional classes
<div className={cn("base-class", isActive && "active-class")} />;

// Overriding tailwind classes
<div className={cn("text-red-500", className)} />; // className can override text color
```
