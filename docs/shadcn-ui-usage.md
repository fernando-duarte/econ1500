# Using Shadcn UI in this Project

This project uses [Shadcn UI](https://ui.shadcn.com/) for its component library. Shadcn UI is not a traditional component library but a collection of reusable components built on top of Tailwind CSS and Radix UI primitives.

## Key Differences from Traditional Component Libraries

Unlike traditional component libraries like Material UI or Chakra UI, Shadcn UI doesn't work through package installation. Instead, it uses a CLI to copy component code directly into your project. This approach has several advantages:

1. **No extra dependencies** - Components become part of your codebase
2. **Full customization** - You can easily modify components to fit your needs
3. **Better performance** - No additional runtime overhead, better tree-shaking
4. **Improved developer experience** - Components can be adapted to your project structure

## Relationship with Radix UI

Shadcn UI is built on top of Radix UI primitives, which provide the unstyled, accessible foundation for many components. When you add a Shadcn UI component, it may require specific Radix UI packages as dependencies. For example:

- The Button component requires `@radix-ui/react-slot`
- Dialog components require `@radix-ui/react-dialog`
- Dropdown Menu components require `@radix-ui/react-dropdown-menu`

The advantage of this approach is that you only install the specific Radix UI primitives you need, rather than the entire library.

## Adding Components

To add a component, use the Shadcn CLI:

```bash
# Add a button component
npx shadcn@latest add button

# Add multiple components at once
npx shadcn@latest add button card toast
```

If the component requires any Radix UI primitives, you'll need to install them:

```bash
# Example: Install dependencies for a dialog component
npm install @radix-ui/react-dialog
```

The components will be added to the `components/ui` directory.

## On-Demand Installation Approach

Instead of installing all Radix UI packages upfront, this project follows an on-demand installation approach:

1. Add only the Shadcn UI components you need for your feature
2. Install only the specific Radix UI primitives required by those components
3. Let Next.js's tree shaking optimize the final bundle

This approach results in a smaller bundle size and better performance compared to installing the entire Radix UI library.

## Available Components

You can browse all available components on the [Shadcn UI website](https://ui.shadcn.com/docs/components/accordion).

Some commonly used components include:

- Button
- Card
- Dialog
- Dropdown Menu
- Form
- Tabs
- Toast

## Using Components

After adding a component, you can import it directly from your components directory:

```tsx
import { Button } from "@/components/ui/button";

export default function MyComponent() {
  return <Button variant="outline">Click me</Button>;
}
```

## Styling and Customization

Components can be customized by:

1. Editing the component files directly
2. Using Tailwind classes with the `className` prop
3. Using the `variants` API when available

Example:

```tsx
<Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
  Custom Button
</Button>
```

## Configuration

Shadcn UI configuration is stored in `components.json` at the root of the project.

## Best Practices

1. **Add components as needed** - Only add the components you actually use
2. **Customize thoughtfully** - Make global style changes in the component files
3. **Use consistent patterns** - Stick to the same variant names across components
4. **Leverage the cn utility** - Use the `cn` utility from `@/lib/utils` for conditional classes
5. **Install dependencies on demand** - Only install the Radix UI primitives you need
