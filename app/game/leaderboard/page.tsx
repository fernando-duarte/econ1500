/**
 * Game Leaderboard Page
 *
 * Displays game scores and rankings.
 */
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MainNavigation } from "@/components/ui/main-navigation";
import { UserInfo, User } from "@/components/ui/UserInfo";
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { Typography } from "@/components/ui/typography";

export default function GameLeaderboardPage() {
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
      <SkipLink href="#leaderboard-interface">Skip to leaderboard interface</SkipLink>

      <MainNavigation />

      <Card
        id="leaderboard-interface"
        className="w-full max-w-md shadow-lg focus-within:outline-none"
        tabIndex={-1}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Game Leaderboard</CardTitle>
          <div className="flex justify-center">{user && <UserInfo user={user} />}</div>
        </CardHeader>
        <CardContent>
          <Typography.Muted className="text-center">
            Game scores and rankings will appear here.
          </Typography.Muted>
        </CardContent>
      </Card>
    </Container>
  );
}
