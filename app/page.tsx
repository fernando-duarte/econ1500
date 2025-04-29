"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { PageContainer } from "@/components/ui/page-container";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [name, setName] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      localStorage.setItem("playerName", trimmedName);
      // Use direct window navigation which is more reliable across browsers
      window.location.href = "/game";
    }
  }

  const handleScrollToForm = () => {
    document.getElementById("game-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageContainer>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Hero>
        <Button onClick={handleScrollToForm}>Get Started</Button>
      </Hero>

      <Container maxWidth="md">
        <Card id="game-form" className="my-12">
          <CardHeader>
            <h2 className="text-center text-2xl font-semibold leading-none tracking-tight">Join the Game</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!name.trim()}>
                Join Game
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </PageContainer>
  );
}
