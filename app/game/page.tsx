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
import { MainNavigation } from '@/components/ui/main-navigation';
import { UserInfo } from '@/components/ui/UserInfo';

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

            // Clear localStorage
            localStorage.removeItem('lastUsername');
            localStorage.removeItem('tokenExpiry');

            // Clear all queries from the cache
            await queryClient.clear();

            // Navigate to home and refresh router cache
            router.replace('/');
            router.refresh();

            // Wait for the redirect to complete
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err: unknown) {
            console.error('Logout failed:', err);
            setLogoutError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoggingOut(false);
        }
    }, [router, queryClient]);

    return (
        <main className="container flex flex-col items-center justify-center min-h-screen py-12 px-4">
            <a
                href="#game-interface"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
                Skip to game interface
            </a>

            <MainNavigation />

            <Card id="game-interface" className="w-full max-w-md shadow-lg focus-within:outline-none" tabIndex={-1}>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Game Interface
                    </CardTitle>
                    <div className="flex justify-center">
                        <UserInfo />
                    </div>
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
                        className="w-32 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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