## Phase 5: Game Session Implementation

### Step 5.1: Game Session Page

**Before:**
No game session page exists.

**After:**

```typescript
// app/game/[id]/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameSession } from "@/components/GameSession";
import { SocketProvider } from "@/lib/socket/provider";

interface GamePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  return {
    title: `Game ${params.id} | Econ1500 Multiplayer`,
    description: "Multiplayer game session",
  };
}

export default function GamePage({ params }: GamePageProps) {
  // Validate game ID format
  if (!params.id || !/^[a-z0-9]{7}$/.test(params.id)) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto w-full max-w-6xl">
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <div className="h-64 rounded bg-gray-200"></div>
              </div>
              <div className="md:col-span-9">
                <div className="h-64 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        }>
          <SocketProvider>
            <GameSession gameId={params.id} />
          </SocketProvider>
        </Suspense>
      </div>
    </main>
  );
}
```

**Implementation Details:**

- Add metadata with dynamic game ID
- Validate game ID format with regex
- Add notFound() for invalid game IDs
- Include responsive skeleton UI in Suspense fallback
- Implement SocketProvider for connection management
- Use grid layout for responsive design

### Step 5.2: Game Session Component

**Before:**
No game session component exists.

**After:**

```typescript
// components/GameSession.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/socket/hooks";
import { useAuth } from "@/lib/auth/context";
import { AnimatePresence, motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";

type Player = {
  id: string;
  name: string;
  isConnected?: boolean;
  joinedAt?: number;
};

type GameState = {
  id: string;
  hostId: string;
  players: Player[];
  status: "waiting" | "active" | "completed";
  currentTurn?: string;
  gameData?: any;
  version: number;
};

export function GameSession({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { socket, isConnected, lastError } = useSocket();
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const gameVersionRef = useRef<number>(0);

  // Reset error when connection status changes
  useEffect(() => {
    if (isConnected) {
      setError(null);
    } else if (lastError) {
      setError(`Connection error: ${lastError}`);
    }
  }, [isConnected, lastError]);

  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    // Join the game room
    socket.emit("join-game", {
      gameId,
      studentId: user.studentId,
      displayName: user.displayName || user.studentId,
    });

    // Listen for game state updates
    const handleGameState = (state: GameState) => {
      // Only update if new version is greater (prevent out-of-order updates)
      if (!gameState || state.version >= gameVersionRef.current) {
        setGameState(state);
        gameVersionRef.current = state.version;
      }
    };

    // Handle player joining
    const handlePlayerJoined = (player: Player) => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        // Check if player already exists
        const playerExists = prevState.players.some(p => p.id === player.id);

        if (playerExists) {
          return {
            ...prevState,
            players: prevState.players.map(p =>
              p.id === player.id ? { ...p, isConnected: true } : p
            ),
          };
        } else {
          return {
            ...prevState,
            players: [...prevState.players, { ...player, isConnected: true }],
          };
        }
      });
    };

    // Handle player leaving
    const handlePlayerLeft = ({ id }: { id: string }) => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        return {
          ...prevState,
          players: prevState.players.map(p =>
            p.id === id ? { ...p, isConnected: false } : p
          ),
        };
      });
    };

    // Handle player disconnection (temporary)
    const handlePlayerDisconnected = ({ id }: { id: string }) => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        return {
          ...prevState,
          players: prevState.players.map(p =>
            p.id === id ? { ...p, isConnected: false } : p
          ),
        };
      });
    };

    // Handle version mismatch
    const handleVersionMismatch = ({ currentVersion }: { currentVersion: number }) => {
      console.log(`Version mismatch: local ${gameVersionRef.current}, server ${currentVersion}`);
      gameVersionRef.current = currentVersion;
      // Request fresh state
      socket.emit("get-game-state", { gameId });
    };

    // Handle game not found
    const handleGameNotFound = () => {
      setError("Game not found or has ended. Redirecting to lobby...");
      setTimeout(() => router.push("/lobby"), 3000);
    };

    // Handle errors
    const handleError = ({ message }: { message: string }) => {
      setError(`Error: ${message}`);
    };

    socket.on("game-state", handleGameState);
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);
    socket.on("player-disconnected", handlePlayerDisconnected);
    socket.on("version-mismatch", handleVersionMismatch);
    socket.on("game-not-found", handleGameNotFound);
    socket.on("error", handleError);

    // Request initial game state
    socket.emit("get-game-state", { gameId });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("game-state", handleGameState);
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
      socket.off("player-disconnected", handlePlayerDisconnected);
      socket.off("version-mismatch", handleVersionMismatch);
      socket.off("game-not-found", handleGameNotFound);
      socket.off("error", handleError);
    };
  }, [socket, isConnected, gameId, user, router]);

  // Handle leaving the game
  const leaveGame = useCallback(() => {
    if (!socket || !isConnected || !user) return;

    setIsLeaving(true);
    socket.emit("leave-game", { gameId, studentId: user.studentId });
    router.push("/lobby");
  }, [socket, isConnected, user, gameId, router]);

  // Game action handler with version tracking
  const performGameAction = useCallback((action: string, data: any) => {
    if (!socket || !isConnected || !gameState) return;

    // Optimistic update
    const updatedState = {
      ...gameState,
      // Apply action-specific updates here
      gameData: {
        ...gameState.gameData,
        // Update based on action type
        ...data
      }
    };

    // Send update with current version
    socket.emit("game-update", {
      gameId,
      gameState: updatedState,
      version: gameVersionRef.current
    });
  }, [socket, isConnected, gameState, gameId]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Connecting to Game...</h2>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-32 rounded bg-gray-200"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gameState) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Loading Game...</h2>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <Skeleton className="h-[400px]" />
              </div>
              <div className="md:col-span-9">
                <Skeleton className="h-[400px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isHost = user?.studentId === gameState.hostId;
  const isCurrentTurn = user?.studentId === gameState.currentTurn;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
        <div>
          <h2 className="text-2xl font-bold">Game Session</h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Game ID: {gameId}</p>
            <Badge variant={gameState.status === "waiting" ? "outline" : gameState.status === "active" ? "default" : "secondary"}>
              {gameState.status === "waiting" ? "Waiting for Players" : gameState.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={leaveGame} disabled={isLeaving}>
          {isLeaving ? "Leaving..." : "Leave Game"}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Players sidebar */}
          <div className="rounded border p-4 md:col-span-3">
            <h3 className="mb-4 text-lg font-medium">Players</h3>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {gameState.players.map((player) => (
                  <TooltipProvider key={player.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`flex items-center justify-between rounded border p-2 ${
                            !player.isConnected ? "opacity-50 bg-muted/50" : ""
                          } ${
                            player.id === gameState.currentTurn ? "border-primary bg-primary/10" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${player.isConnected ? "bg-green-500" : "bg-gray-400"}`}></div>
                            <p className="font-medium truncate max-w-[120px]">
                              {player.name}
                              {player.id === user?.studentId && " (You)"}
                            </p>
                          </div>
                          {player.id === gameState.hostId && (
                            <Badge variant="outline" className="ml-1 text-xs">Host</Badge>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{player.isConnected ? "Online" : "Offline"}</p>
                        {player.id === gameState.hostId && <p>Game Host</p>}
                        {player.id === gameState.currentTurn && <p>Current Turn</p>}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Game area */}
          <div className="md:col-span-9">
            <div className="flex h-[30rem] flex-col rounded-lg border">
              <div className="border-b bg-muted/40 p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">
                    {gameState.status === "waiting"
                      ? "Waiting for Players..."
                      : gameState.status === "active"
                      ? isCurrentTurn
                        ? "Your Turn"
                        : `${gameState.players.find(p => p.id === gameState.currentTurn)?.name || 'Someone'}'s Turn`
                      : "Game Completed"}
                  </h3>

                  {isHost && gameState.status === "waiting" && (
                    <Button
                      size="sm"
                      onClick={() => performGameAction("start-game", { status: "active" })}
                      disabled={gameState.players.length < 1}
                    >
                      Start Game
                    </Button>
                  )}
                </div>
              </div>

              {/* Game UI will be implemented here */}
              <div className="flex flex-1 items-center justify-center p-4">
                {gameState.status === "waiting" ? (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      {isHost
                        ? "Waiting for players to join. You can start the game when ready."
                        : "Waiting for the host to start the game."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {gameState.players.length} player{gameState.players.length !== 1 ? "s" : ""} in the lobby
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Game interface will be implemented here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Implementation Details:**

- Add version tracking for optimistic updates
- Implement player presence visualization
- Add host controls for game management
- Use animations for player status changes
- Implement responsive layout for different devices
- Add tooltips for additional information
- Use badges for status indication
- Add optimistic UI updates for actions
  </rewritten_file>
