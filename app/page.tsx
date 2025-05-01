/**
 * Login Page
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  username: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores"),
});

// Type for form values
type LoginFormValues = z.infer<typeof formSchema>;

// Type for API error response
type ApiError = {
  error: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Initialize form with empty values for SSR compatibility
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    },
  });

  const { isSubmitting } = form.formState;

  // Load saved username after mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('lastUsername');
    if (savedUsername) {
      form.reset({ username: savedUsername });
    }
  }, [form]);

  // Handle form submission
  const onSubmit = useCallback(async (values: LoginFormValues) => {
    try {
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: values.username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Login failed');
      }

      // Store username for future use
      localStorage.setItem('lastUsername', values.username);

      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <h1 className="text-4xl font-bold tracking-tight">ECON1500</h1>
          <h2 className="text-2xl text-muted-foreground">The China Growth Game</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              role="alert"
              aria-live="assertive"
            >
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
              aria-label="Login form"
              aria-busy={isSubmitting}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username-input">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="username-input"
                        placeholder="Enter your name"
                        disabled={isSubmitting}
                        aria-label="Your name"
                        autoComplete="username"
                        autoFocus
                        className="transition-colors"
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
