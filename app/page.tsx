/**
 * Homepage - Simple Hello World page
 */
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">ECON1500 Multiplayer Game</h1>
      <p className="text-lg mb-8">
        Welcome to the real-time economic simulation game for ECON1500.
      </p>
      <div className="flex gap-4">
        <Link
          href="/game"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Play Game
        </Link>
      </div>
    </div>
  );
}
