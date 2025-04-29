"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      <PageContainer className="items-center justify-center">
        <div className="border-primary h-16 w-16 animate-spin rounded-full border-t-2 border-b-2"></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="full" className="p-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-primary text-3xl font-bold">ECON 1500</h1>
            <h2 className="text-2xl font-bold">Game Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <div
              data-testid="player-name-display"
              className="bg-muted/20 text-foreground rounded-full px-4 py-2 font-medium"
            >
              Player: {playerName}
            </div>
            <ThemeToggle />
            <Button variant="destructive" onClick={handleExitGame}>
              Exit Game
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center">
          <Card className="w-full max-w-4xl">
            <CardHeader>
              <CardTitle className="text-center">Game Content Goes Here</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Welcome, {playerName}! This is where the actual game content would be displayed.
              </p>
            </CardContent>
          </Card>
        </main>
      </Container>
    </PageContainer>
  );
}
