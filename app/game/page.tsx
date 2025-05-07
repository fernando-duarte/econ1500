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
import { GdpPieChart } from "@/components/game/GdpPieChart";
import { growthModel } from "@/lib/constants";
import { runRound } from "@/lib/game/engine";
import type { Controls as ControlsType } from "@/lib/game/types";
import type { State } from "@/lib/game/types";

export default function GamePage() {
  // Get username from localStorage for display
  // const username =
  //   typeof window !== "undefined" ? localStorage.getItem("lastUsername") || "User" : "User";

  const [history, setHistory] = useState([growthModel.initialState]);
  // State for live controls to track real-time changes
  const [liveControls, setLiveControls] = useState<ControlsType>({
    savingRate: 0.1,
    exchangePolicy: 1.0,
  });

  // Calculate current round and year
  const currentRound = history.length;
  const totalRounds = 10; // (2025 - 1980) / 5 + 1
  const currentYear = 1980 + (currentRound - 1) * 5;

  // Socket setup
  useEffect(() => {
    console.log("[CLIENT] GamePage useEffect running for socket setup.");
    const socket = getSocket();
    let currentSessionId = ""; // Keep track of the session ID for this instance

    const handleConnect = () => {
      currentSessionId = `sess_${socket.id}`;
      console.log(
        `[CLIENT] Connected to socket server with ID: ${socket.id}. Attempting to join session: ${currentSessionId}`
      );
      socket.emit("join", currentSessionId);

      // Remove previous listener if any (e.g., on reconnect) to avoid duplicates
      socket.off("state");
      socket.on("state", (h: State[]) => {
        // Assuming State[] is the correct type from your project
        console.log(
          `[CLIENT] Received 'state' event for session ${currentSessionId}. New history:`,
          h
        );
        // Detailed logging for each state in the received history
        if (Array.isArray(h)) {
          h.forEach((stateItem, index) => {
            console.log(
              `[CLIENT] History item ${index}: Year: ${stateItem.year}, A: ${stateItem.A}, Type of A: ${typeof stateItem.A}`
            );
            if (stateItem.A === null) {
              console.error(
                `[CLIENT] CRITICAL: stateItem.A is null for year ${stateItem.year} at index ${index} in received history!`
              );
            }
          });
        }
        setHistory(h);
      });
    };

    const handleDisconnect = (reason: string) => {
      console.warn(
        `[CLIENT] Socket disconnected from session ${currentSessionId}. Reason:`,
        reason
      );
      // No need to setHistory([]) here, as the server might retain the session
    };

    const handleConnectError = (error: Error) => {
      console.error(`[CLIENT] Socket connection error for session ${currentSessionId}:`, error);
    };

    // Setup listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // If socket is already connected when this effect runs, manually trigger connect handling.
    // This can happen with fast connections or if getSocket() reuses an active connection.
    if (socket.connected) {
      console.log(
        "[CLIENT] Socket already connected on useEffect mount. Manually triggering connect handler."
      );
      handleConnect();
    }

    return () => {
      console.log(
        `[CLIENT] Cleaning up GamePage useEffect. Socket ID was: ${socket.id}, Session ID was: ${currentSessionId}`
      );
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("state"); // Also ensure state listener is removed
      // Consider if socket.disconnect() is needed here; usually not if socket is managed globally by getSocket()
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // Current state and preview calculation
  const prev = history.length > 0 ? history[history.length - 1] : growthModel.initialState;
  const exogIndex = Math.min(history.length - 1, growthModel.exogenous.length - 1);
  const exog = growthModel.exogenous[exogIndex] || growthModel.exogenous[0];
  // Use liveControls for the preview calculation to update in real-time
  const preview = runRound(
    prev as import("@/lib/game/types").State,
    liveControls,
    exog as import("@/lib/game/types").ExogRow
  );

  // Handle form submission
  function handleSubmit(controls: ControlsType) {
    const socket = getSocket();
    if (!socket.connected) {
      console.error("[CLIENT] handleSubmit: Socket not connected. Cannot submit round.");
      // Optionally, provide user feedback (e.g., a toast notification)
      return;
    }
    // IMPORTANT: Use the sessionId established during the 'connect' event if possible,
    // or ensure the server can handle new socket.id for an existing logical session.
    // For now, we'll use the current socket.id, assuming the server handles session continuity or it's a fresh session.
    const submissionSessionId = `sess_${socket.id}`;
    console.log(
      `[CLIENT] handleSubmit called. Emitting 'submit-round'. SessionId: ${submissionSessionId}, Controls:`,
      controls
    );
    setLiveControls(controls); // Update live controls on submit
    socket.emit("submit-round", { sessionId: submissionSessionId, controls });
  }

  // Handle real-time control changes
  function handleControlChange(controls: ControlsType) {
    setLiveControls(controls);
  }

  return (
    <AuthenticatedLayout>
      <Container className="flex flex-col items-center justify-center px-4">
        <SkipLink href="#game-interface">Skip to game interface</SkipLink>

        <Card id="game-interface" className="w-full max-w-5xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Year: {currentYear}</CardTitle>
            <div className="text-center">
              <p>
                Round {currentRound}/{totalRounds}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Game UI */}
            <div className="flex flex-col gap-8 md:flex-row">
              {/* Left column: Dashboard and Controls */}
              <div className="flex flex-1 flex-col gap-8">
                {/* 1. Dashboard with state variables */}
                <div>
                  <CardTitle className="mb-4 text-xl">Current Values:</CardTitle>
                  {prev && <Dashboard prev={prev} />}
                </div>

                {/* 2. Controls */}
                <div>
                  <CardTitle className="mb-4 text-xl">
                    Make your policy choices for the next five years ({currentYear} to{" "}
                    {currentYear + 4}):
                  </CardTitle>
                  <Controls onSubmit={handleSubmit} onChange={handleControlChange} />
                </div>
              </div>

              {/* Right column: GDP Composition Pie Chart and History */}
              <div className="flex-1">
                {preview && <GdpPieChart data={preview} />}
                <div className="mt-8">
                  <History data={history} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
