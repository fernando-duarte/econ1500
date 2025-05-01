/**
 * Game page
 */
'use client';

import { useRouter } from 'next/navigation';

export default function GamePage() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the session token
        document.cookie = 'session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/');
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-6">ECON1500 Game Interface</h1>
            <p className="text-lg mb-8">
                This is where the game interface will be implemented.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={handleLogout}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
} 