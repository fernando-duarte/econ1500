/**
 * Login Page
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  username: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
});

type LoginFormValues = z.infer<typeof formSchema>;
type ApiError = { error: string };

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
  });
  const { isSubmitting } = form.formState;

  useEffect(() => {
    const saved = localStorage.getItem('lastUsername');
    if (saved) form.reset({ username: saved });
  }, [form]);

  const onSubmit = useCallback(async (values: LoginFormValues) => {
    try {
      setError(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: values.username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as ApiError).error || 'Login failed');
      localStorage.setItem('lastUsername', values.username);
      await new Promise(r => setTimeout(r, 500));
      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle>ECON1500</CardTitle>
          <CardDescription>The China Growth Game</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              id="login-form"
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
                        autoComplete="username"
                        autoFocus
                        className="transition-colors"
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="w-full"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
