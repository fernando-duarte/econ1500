## Phase 2: Authentication & Login

### Step 2.1: Authentication Context

**Before:**
No authentication management exists.

**After:**

```typescript
// lib/auth/context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";

// Session expiry time - 12 hours
const SESSION_EXPIRY = 12 * 60 * 60 * 1000;

const userSessionSchema = z.object({
  studentId: z.string(),
  displayName: z.string().optional(),
  expiresAt: z.number(),
});

type UserSession = z.infer<typeof userSessionSchema>;

type User = {
  studentId: string;
  displayName?: string;
};

type AuthContextType = {
  user: User | null;
  login: (studentId: string, displayName?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const loadUserSession = () => {
      try {
        const sessionData = localStorage.getItem("userSession");

        if (!sessionData) {
          setIsLoading(false);
          return;
        }

        const session = userSessionSchema.parse(JSON.parse(sessionData));

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
          localStorage.removeItem("userSession");
          setIsLoading(false);
          return;
        }

        setUser({
          studentId: session.studentId,
          displayName: session.displayName
        });
      } catch (error) {
        // Invalid session data, clear it
        console.error("Error loading user session:", error);
        localStorage.removeItem("userSession");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const login = (studentId: string, displayName?: string) => {
    // Create session with expiry
    const session: UserSession = {
      studentId,
      displayName,
      expiresAt: Date.now() + SESSION_EXPIRY,
    };

    localStorage.setItem("userSession", JSON.stringify(session));
    setUser({ studentId, displayName });
  };

  const logout = () => {
    localStorage.removeItem("userSession");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

**Implementation Details:**

- Add session expiration with timestamp
- Implement secure session storage with Zod validation
- Add loading state to prevent flashes during authentication check
- Include error handling for corrupted session data
- Use schema validation for parsing stored session data

### Step 2.2: Route Protection Middleware

**Before:**
No route protection exists.

**After:**

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const protectedPaths = ["/lobby", "/game"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    // Check for session cookie
    const hasUserSession = request.cookies.has("userSession");

    if (!hasUserSession) {
      // Redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = `?redirect=${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lobby/:path*", "/game/:path*"],
};
```

**Implementation Details:**

- Create middleware for route protection
- Add redirect with original path for post-login navigation
- Use cookie-based session check for SSR compatibility
- Configure matcher for protected routes only

### Step 2.3: Login Form Component

**Before:**
No login form exists.

**After:**

```typescript
// components/LoginForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth/context";
import { mockStudents } from "@/lib/schema/student";

import {
  Card,
  CardHeader,
  CardContent,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  ComboBox,
  Button,
  Input,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui";

const formSchema = z.object({
  studentId: z.string({
    required_error: "Please select your name from the list.",
  }),
  displayName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get redirect path from URL if present
  const redirectPath = searchParams.get('redirect') || '/lobby';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      displayName: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setFormError(null);

    try {
      // Set cookie for server-side auth check
      document.cookie = `userSession=true; path=/; max-age=${60 * 60 * 12}`;

      // Update auth context
      login(values.studentId, values.displayName);

      // Navigate to redirect path or lobby
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Handle empty student list
  if (mockStudents.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Students Available</AlertTitle>
        <AlertDescription>
          There are no students registered in the system. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">Welcome</h2>
        <p className="text-center text-muted-foreground">Find your name to begin</p>
      </CardHeader>
      <CardContent>
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <ComboBox
                      options={mockStudents.map((student) => ({
                        label: student.name,
                        value: student.id,
                      }))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="How you want to be called in the game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Start Game"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

**Implementation Details:**

- Add support for redirect parameter after login
- Add explicit error display for login failures
- Handle empty student list with fallback message
- Add server-side cookie for middleware auth check
- Check existing authentication to prevent duplicate login
