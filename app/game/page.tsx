/**
 * Game Page
 *
 * Main game interface that displays after successful authentication.
 */
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { getSocket } from "@/lib/socket";
import { Controls } from "@/components/game/Controls";
import { Dashboard } from "@/components/game/Dashboard";
import { History } from "@/components/game/History";
import { growthModel } from "@/lib/constants";
import { runRound } from "@/lib/game/engine";
import type { Controls as ControlsType } from "@/lib/game/types";

export default function GamePage() {
  // Get username from localStorage for display
  const username =
    typeof window !== "undefined" ? localStorage.getItem("lastUsername") || "User" : "User";

  const [history, setHistory] = useState([growthModel.initialState]);
  const [lastControls, setLastControls] = useState<ControlsType>({
    savingRate: 0.1,
    exchangePolicy: 1.0,
  });

  // Socket setup
  useEffect(() => {
    const socket = getSocket();
    const sessionId = `sess_${socket.id}`;

    socket.emit("join", sessionId);
    socket.on("state", (h) => setHistory(h));

    return () => {
      socket.off("state");
    };
  }, []);

  // Current state and preview calculation
  const prev = history.length > 0 ? history[history.length - 1] : growthModel.initialState;
  const exogIndex = Math.min(history.length - 1, growthModel.exogenous.length - 1);
  const exog = growthModel.exogenous[exogIndex] || growthModel.exogenous[0];
  const preview = runRound(prev, lastControls, exog);

  // Handle form submission
  function handleSubmit(controls: ControlsType) {
    const socket = getSocket();
    const sessionId = `sess_${socket.id}`;

    setLastControls(controls);
    socket.emit("submit-round", { sessionId, controls });
  }

  return (
    <AuthenticatedLayout>
      <Container className="flex flex-col items-center justify-center px-4">
        <SkipLink href="#game-interface">Skip to game interface</SkipLink>

        <Card id="game-interface" className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Game Interface</CardTitle>
            <div className="text-center">
              <p>Welcome, {username}!</p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Game UI */}
            {/* 1. Controls */}
            <Controls onSubmit={handleSubmit} />

            {/* 2. Dashboard */}
            {prev && preview && <Dashboard prev={prev} preview={preview} />}

            {/* 3. History */}
            <History data={history} />
          </CardContent>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
