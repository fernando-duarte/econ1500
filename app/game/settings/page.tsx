/**
 * Game Settings Page
 *
 * Allows users to configure game settings.
 */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MainNavigation } from "@/components/ui/main-navigation";
import { UserInfo, User } from "@/components/ui/UserInfo";

export default function GameSettingsPage() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastUsername");
    if (stored) {
      setUsername(stored);
    }
  }, []);

  const user: User | null = username ? { name: username } : null;

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <a
        href="#settings-interface"
        className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:ring-2 focus:outline-none"
      >
        Skip to settings interface
      </a>

      <MainNavigation />

      <Card
        id="settings-interface"
        className="w-full max-w-md shadow-lg focus-within:outline-none"
        tabIndex={-1}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Game Settings</CardTitle>
          <div className="flex justify-center">{user && <UserInfo user={user} />}</div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Game settings configuration options will appear here.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
