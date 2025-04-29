# Performance Optimization with Shadcn UI

## Overview

This document provides best practices for optimizing performance in our application after migrating to Shadcn UI. While Shadcn UI components are designed to be lightweight and performant, there are several steps we can take to ensure our application remains fast and responsive.

## Bundle Size Optimization

### Component Imports

Import only the components you need rather than importing everything:

```typescript
// Good: Specific imports
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Bad: Importing everything
import * as UI from "@/components/ui";
```

### Tree Shaking

Ensure your bundler's tree shaking is properly configured. In Next.js 15, this is typically handled automatically, but verify that:

- All dependencies are ES modules
- No side effects are preventing tree shaking
- Add `"sideEffects": false` to package.json for components that can be safely tree-shaken

## Rendering Optimization

### Server Components

Use Server Components where possible to reduce JavaScript bundle size sent to the client:

```typescript
// page.tsx (Server Component)
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <h1>Server Component</h1>
      <Button>Click me</Button>
    </div>
  );
}
```

### Client Components

Mark components as client components only when necessary (i.e., when they need interactivity or hooks):

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </div>
  );
}
```

## Image Optimization

### Next.js Image Component

Always use the Next.js Image component with proper sizing:

```typescript
import Image from "next/image";

export function OptimizedImage() {
  return (
    <Image
      src="/hero/economy-hero.png"
      alt="Economics Hero"
      width={1200}
      height={800}
      priority
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
    />
  );
}
```

## CSS Optimization

### Utility Class Deduplication

Our tailwind-merge utility (`cn`) helps prevent CSS bloat by deduplicating classes:

```typescript
import { cn } from "@/lib/utils";

// This will only include rounded-lg once in the output
<div className={cn(
  "rounded-lg bg-card",
  someCondition && "rounded-lg bg-primary"
)}>
```

### Dynamic Class Generation

Use class-variance-authority for dynamic classes to reduce CSS output:

```typescript
const buttonVariants = cva("base styles...", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      // ...
    },
    // ...
  },
});
```

## Preloading and Prefetching

### Link Component Prefetching

Use Next.js Link component with prefetch:

```typescript
import Link from "next/link";

<Link href="/game" prefetch>
  Go to Game
</Link>
```

### Route Handlers

For critical routes, consider manually prefetching:

```typescript
// In component that leads to /game
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function GameEntryPoint() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch the game route
    router.prefetch("/game");
  }, [router]);

  // ...
}
```

## Monitoring Performance

### Lighthouse

Regularly run Lighthouse audits to identify performance issues:

```bash
# Using CLI
npx lighthouse https://your-site.com --view
```

### Web Vitals

Monitor Web Vitals in production:

```typescript
// pages/_app.tsx
export function reportWebVitals(metric) {
  // Send to analytics
  console.log(metric);
}
```

## Caching Strategies

### React Query / SWR

For data fetching, use React Query or SWR for efficient caching:

```typescript
import { useQuery } from "@tanstack/react-query";

function PlayerStats() {
  const { data } = useQuery({
    queryKey: ["playerStats"],
    queryFn: fetchPlayerStats,
    staleTime: 60 * 1000, // 1 minute
  });

  // ...
}
```

## Development Workflow

### Production Builds for Testing

Always test performance with production builds:

```bash
npm run build
npm start
```

### Analyze Bundle

Use the Next.js bundle analyzer to identify large dependencies:

```bash
ANALYZE=true npm run build
```
