/**
 * Game page
 */
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function GamePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const handleLogout = useCallback(async () => {
        setLogoutError(null);
        setIsLoggingOut(true);

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Clear all queries from the cache
            await queryClient.clear();

            // Navigate to home and refresh router cache
            router.replace('/');
            router.refresh();
        } catch (err: unknown) {
            console.error('Logout failed:', err);
            setLogoutError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoggingOut(false);
        }
    }, [router, queryClient]);

    return (
        <main className="container flex items-center justify-center min-h-screen py-12 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Game Interface
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {logoutError && (
                        <Alert
                            variant="destructive"
                            role="alert"
                            className="mb-4"
                        >
                            <AlertTitle>Logout Failed</AlertTitle>
                            <AlertDescription>{logoutError}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-32"
                        aria-busy={isLoggingOut}
                    >
                        {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
} 