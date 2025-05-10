/**
 * Login Page
 *
 * Main entry point for the application. Handles user authentication
 * through name input or student selection from a dropdown.
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Loader2, X } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { students } from "@/lib/students";
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";

// Form validation schema
const formSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .refine(
      (value) => {
        // Check for excessive whitespace
        return !value.includes("  ") && !value.startsWith(" ") && !value.endsWith(" ");
      },
      {
        message: "Too many spaces",
      }
    )
    .refine(
      (value) => {
        // Simple profanity check
        const profanityList = ["badword", "profanity", "inappropriate"];
        return !profanityList.some((word) => value.toLowerCase().includes(word.toLowerCase()));
      },
      {
        message: "Inappropriate language",
      }
    ),
});

type LoginFormValues = z.infer<typeof formSchema>;
type ApiError = { error: string };

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");

  // Convert students array to format needed by Combobox
  const studentOptions = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "" },
  });
  const { isSubmitting } = form.formState;
  const { setValue } = form;

  useEffect(() => {
    const saved = localStorage.getItem("lastUsername");
    if (saved) form.reset({ username: saved });
  }, [form]);

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        setError(null);
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: values.username }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 500) {
            throw new Error("Server error occurred");
          }
          throw new Error((data as ApiError).error || "Login failed");
        }
        localStorage.setItem("lastUsername", values.username);
        await new Promise((r) => setTimeout(r, 250));

        // Don't reset isSubmitting by not using try-finally pattern
        // This keeps the loading state active during navigation
        router.push("/game");

        // We intentionally don't reset the form or loading state here
        // to keep the spinner visible during navigation
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        // Only reset isSubmitting on error
        form.reset({ username: values.username });
      }
    },
    [router, form]
  );

  return (
    <Container className="flex min-h-screen flex-col items-center justify-center px-4">
      <SkipLink href="#login-form">Skip to login form</SkipLink>
      <Card className="w-full max-w-md focus-within:outline-none">
        <CardHeader className="space-y-2 pb-6 text-center">
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

          <Stack gap="4">
            <Stack gap="2">
              <Label id="student-select-label">Select your name</Label>
              <Combobox
                items={studentOptions}
                value={selectedStudent}
                onValueChange={(value) => {
                  setSelectedStudent(value);
                  // Populate the username input with the selected student's label
                  const found = studentOptions.find((item) => item.value === value);
                  setValue("username", found?.label ?? "");
                }}
                placeholder="Search for your name..."
                searchPlaceholder="Type to search..."
                emptyText="No student found"
                className="focus-within:ring-ring w-full focus-within:ring-2 focus-within:ring-offset-2"
                aria-labelledby="student-select-label"
              />
            </Stack>

            <div className="relative">
              <Separator className="my-4" />
              <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs uppercase">
                Or enter manually
              </span>
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
                            className="focus-visible:ring-ring pr-8 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
                          />
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="hover:bg-accent/10 absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                              onClick={() => form.setValue("username", "")}
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
          </Stack>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            form="login-form"
            className="focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:ring-offset-2"
            disabled={isSubmitting || !form.watch("username")}
            aria-disabled={isSubmitting || !form.watch("username")}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
