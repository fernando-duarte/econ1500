"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            password: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        setError(null);

        try {
            // Simulate login API call with the form values
            console.log(`Logging in with ID: ${values.studentId}`);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store token in cookie
            document.cookie = `session-token=example-token; path=/; max-age=${60 * 60 * 12}`;

            // Use environment variable for redirect URL (with fallback)
            const redirectUrl = process.env.NEXT_PUBLIC_LOGIN_REDIRECT || '/';
            router.push(redirectUrl);
        } catch (error) {
            console.error("Login error:", error);
            setError("Failed to log in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                            Student ID
                        </label>
                        <input
                            id="studentId"
                            type="text"
                            {...form.register('studentId')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        {form.formState.errors.studentId && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.studentId.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...form.register('password')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        {form.formState.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 