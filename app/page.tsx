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
import { Loader2, X } from 'lucide-react';
import { Combobox } from '@/components/ui/combobox';
import { students } from '@/lib/students';

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
  const [selectedStudent, setSelectedStudent] = useState('');

  // Convert students array to format needed by Combobox
  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name
  }));

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' },
  });
  const { isSubmitting } = form.formState;
  const { setValue } = form;

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
      await new Promise(r => setTimeout(r, 250));
      router.push('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }, [router]);

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to login form
      </a>
      <Card className="w-full max-w-md focus-within:outline-none">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select your name
              </label>
              <Combobox
                items={studentOptions}
                value={selectedStudent}
                onValueChange={(value) => {
                  setSelectedStudent(value);
                  // Populate the username input with the selected student's label
                  const found = studentOptions.find(item => item.value === value);
                  setValue('username', found?.label ?? '');
                }}
                placeholder="Search for your name..."
                searchPlaceholder="Type to search..."
                emptyText="No student found"
                className="w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <Form {...form}>
              <form
                id="login-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
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
                        <div className="relative">
                          <Input
                            {...field}
                            id="username-input"
                            placeholder="Enter your name"
                            disabled={isSubmitting}
                            autoComplete="username"
                            autoFocus
                            className="transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-8"
                          />
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-accent/10"
                              onClick={() => form.setValue('username', '')}
                              aria-label="Clear name"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage role="alert" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="w-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isSubmitting || !form.watch('username')}
            aria-disabled={isSubmitting || !form.watch('username')}
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
