## Phase 6: Auth Protection Component

### Step 6.1: Authentication Required Component

**Before:**
No authentication wrapper component exists.

**After:**

```typescript
// components/AuthRequired.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

import {
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
} from "@/components/ui";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mx-auto w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <div className="mx-auto w-full max-w-md">
          <Alert variant="destructive">
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to log in to access this page. Redirecting...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return children;
}
```

**Implementation Details:**

- Add loading state handling
- Include redirect with current pathname
- Show informative message during redirection
- Use client-side auth check for immediate feedback
- Include skeleton UI during loading
- Return children only when authenticated

### Step 6.2: Socket Provider Component

**Before:**
No dedicated Socket provider exists.

**After:**

```typescript
// lib/socket/provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useSocket as useSocketHook } from "./hooks";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastError: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket, isConnected, lastError } = useSocketHook();

  // Context value never changes reference because socket is a singleton
  const value = { socket, isConnected, lastError };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
}
```

**Implementation Details:**

- Create dedicated provider for socket context
- Expose socket instance, connection status, and errors
- Use singleton socket instance from hooks
- Provide context wrapper for components needing socket access
- Include error handling for improper context usage

## Phase 7: Layout and Global Components

### Step 7.1: Root Layout

**Before:**
No custom layout exists.

**After:**

```typescript
// app/layout.tsx
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Econ1500 Multiplayer",
    default: "Econ1500 Multiplayer Game",
  },
  description: "Interactive multiplayer game for Econ1500 students",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Implementation Details:**

- Set up font optimization with next/font
- Add metadata with template for consistent titles
- Include viewport settings for responsive design
- Add suppressHydrationWarning to prevent hydration errors
- Wrap application in AuthProvider for global auth state
- Set up base CSS variables in globals.css

### Step 7.2: Home Page

**Before:**
No home page exists.

**After:**

```typescript
// app/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Econ1500 Multiplayer",
  description: "Log in to play interactive multiplayer games",
};

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-4xl font-bold tracking-tight">
          Econ1500 Multiplayer
        </h1>
        <Suspense fallback={
          <div className="w-full animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
```

**Implementation Details:**

- Create centered layout for login form
- Add SEO metadata with proper title and description
- Include Suspense boundary with skeleton UI
- Use container class for responsive padding
- Add responsive height with min-h-[80vh]
- Use flexbox for vertical centering
