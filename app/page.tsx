"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Trim whitespace before storing in localStorage
      localStorage.setItem("playerName", name.trim());
      // Navigate to game page - you would create this page next
      router.push("/game");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Hero>
        <button
          onClick={() => document.getElementById('game-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="rounded-lg bg-indigo-600 px-5 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Get Started
        </button>
      </Hero>

      <div id="game-form" className="w-full max-w-md rounded-xl bg-white p-8 my-12 shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
          Join the Game
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-center font-medium text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={!name.trim()}
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}
