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
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { Typography } from "@/components/ui/typography";

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
    <Container
      as="main"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
    >
      <SkipLink href="#settings-interface">Skip to settings interface</SkipLink>

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
          <Typography.Muted className="text-center">
            Game settings configuration options will appear here.
          </Typography.Muted>
        </CardContent>
      </Card>
    </Container>
  );
}
