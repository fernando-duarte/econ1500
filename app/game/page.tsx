/**
 * Game Page
 *
 * Main game interface that displays after successful authentication.
 */
"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export default function GamePage() {
  // Get username from localStorage for display
  const username =
    typeof window !== "undefined" ? localStorage.getItem("lastUsername") || "User" : "User";

  return (
    <AuthenticatedLayout>
      <Container className="flex flex-col items-center justify-center px-4">
        <SkipLink href="#game-interface">Skip to game interface</SkipLink>

        <Card
          id="game-interface"
          className="w-full max-w-md shadow-lg focus-within:outline-none"
          tabIndex={-1}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">Game Interface</CardTitle>
            <div className="text-center">
              <p>Welcome, {username}!</p>
              <p className="text-muted-foreground mt-4 text-sm">
                This is the main game interface where gameplay will be implemented.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center">Game content will appear here.</p>
          </CardContent>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
