/**
 * Game page
 */
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
                <CardContent className="flex flex-col items-center">
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
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-32"
                        aria-busy={isLoggingOut}
                    >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
} 