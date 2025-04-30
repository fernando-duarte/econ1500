/**
 * Game page
 */
'use client';

import Link from 'next/link';

export default function GamePage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-6">ECON1500 Game Interface</h1>
            <p className="text-lg mb-8">
                This is where the game interface will be implemented.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
} 