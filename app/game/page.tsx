"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const [playerName, setPlayerName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve player name from localStorage
    const storedName = localStorage.getItem("playerName");

    // If no name exists, redirect back to login
    if (!storedName) {
      router.push("/");
      return;
    }

    setPlayerName(storedName);
  }, [router]);

  const handleExitGame = () => {
    localStorage.removeItem("playerName");
    router.push("/");
  };

  if (!playerName) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-indigo-100 p-8 dark:from-gray-900 dark:to-gray-800">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
            ECON 1500
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Game Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-full bg-indigo-100 px-4 py-2 font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            Player: {playerName}
          </div>
          <button
            onClick={handleExitGame}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Exit Game
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
            Game Content Goes Here
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Welcome, {playerName}! This is where the actual game content would be displayed.
          </p>
        </div>
      </main>
    </div>
  );
} 