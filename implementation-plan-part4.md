## Phase 4: Game Lobby Implementation

### Step 4.1: Game Lobby Page

**Before:**
No game lobby page exists.

**After:**

```typescript
// app/lobby/page.tsx
import { Suspense } from "react";
import { Metadata } from "next";
import { GameLobby } from "@/components/GameLobby";
import { SocketProvider } from "@/lib/socket/provider";

export const metadata: Metadata = {
  title: "Game Lobby | Econ1500 Multiplayer",
  description: "Create or join multiplayer game sessions",
};

export default function LobbyPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto w-full max-w-4xl">
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-12 rounded bg-gray-200"></div>
            <div className="h-64 rounded bg-gray-200"></div>
          </div>
        }>
          <SocketProvider>
            <GameLobby />
          </SocketProvider>
        </Suspense>
      </div>
    </main>
  );
}
```

**Implementation Details:**

- Add metadata for SEO optimization
- Add SocketProvider to manage socket connection
- Include specific Suspense fallback with skeleton UI
- Use client component boundary for socket management

### Step 4.2: Game Lobby Component

**Before:**
No game lobby component exists.

**After:**

```typescript
// components/GameLobby.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/socket/hooks";
import { useAuth } from "@/lib/auth/context";
import { AnimatePresence, motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Skeleton,
  Alert,
  AlertTitle,
  AlertDescription,
  ScrollArea,
} from "@/components/ui";

type Player = {
  id: string;
  name: string;
  isConnected: boolean;
  joinedAt: number;
};

type GameSession = {
  id: string;
  hostId: string;
  hostName: string;
  players: Player[];
  playerCount: number;
  status: "waiting" | "active" | "completed";
  createdAt: number;
  version: number;
};

export function GameLobby() {
  const router = useRouter();
  const { socket, isConnected, lastError } = useSocket();
  const { user } = useAuth();
  const [activeGames, setActiveGames] = useState<GameSession[]>([]);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset error when connection status changes
  useEffect(() => {
    if (isConnected) {
      setError(null);
    } else if (lastError) {
      setError(lastError);
    }
  }, [isConnected, lastError]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen for active games updates
    const handleActiveGames = (games: GameSession[]) => {
      setActiveGames(games);
    };

    // Handle game creation response
    const handleGameCreated = (gameId: string) => {
      setIsCreatingGame(false);
      router.push(`/game/${gameId}`);
    };

    // Handle errors
    const handleError = ({ message }: { message: string }) => {
      setError(message);
      setIsCreatingGame(false);
      setIsJoiningGame(null);
    };

    // Handle game not found
    const handleGameNotFound = () => {
      setError("Game not found or has ended.");
      setIsJoiningGame(null);
    };

    socket.on("active-games", handleActiveGames);
    socket.on("game-created", handleGameCreated);
    socket.on("error", handleError);
    socket.on("game-not-found", handleGameNotFound);

    // Request initial active games
    socket.emit("get-active-games");

    return () => {
      socket.off("active-games", handleActiveGames);
      socket.off("game-created", handleGameCreated);
      socket.off("error", handleError);
      socket.off("game-not-found", handleGameNotFound);
    };
  }, [socket, isConnected, router]);

  const createNewGame = useCallback(() => {
    if (!socket || !isConnected || !user) return;

    setIsCreatingGame(true);
    setError(null);

    socket.emit("create-game", {
      hostId: user.studentId,
      hostName: user.displayName || user.studentId,
    });
  }, [socket, isConnected, user]);

  const joinGame = useCallback((gameId: string) => {
    if (!socket || !isConnected || !user) return;

    setIsJoiningGame(gameId);
    setError(null);

    socket.emit("join-game", {
      gameId,
      studentId: user.studentId,
      displayName: user.displayName || user.studentId,
    });

    router.push(`/game/${gameId}`);
  }, [socket, isConnected, user, router]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Connecting to server...</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Game Lobby</h2>
        <p className="text-muted-foreground">Create a new game or join an existing one</p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-6">
          <Button
            onClick={createNewGame}
            className="w-full"
            disabled={isCreatingGame}
          >
            {isCreatingGame ? "Creating game..." : "Create New Game"}
          </Button>

          <div className="rounded-md border p-4">
            <h3 className="mb-4 text-lg font-medium">Active Games</h3>

            {activeGames.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {activeGames.map((game) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between rounded border p-3"
                      >
                        <div>
                          <p className="font-medium">{game.hostName}'s Game</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              {game.playerCount} players
                            </p>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="text-sm text-muted-foreground">
                              {game.status === "waiting" ? "Waiting" : game.status === "active" ? "Active" : "Completed"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => joinGame(game.id)}
                          disabled={isJoiningGame === game.id}
                        >
                          {isJoiningGame === game.id ? "Joining..." : "Join"}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </ScrollArea>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No active games. Create one to start playing!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Implementation Details:**

- Add individual loading states for each game
- Use framer-motion for smooth animations
- Add ScrollArea for scrollable game list
- Include proper error handling with alerts
- Add visual feedback for joining/creating games
- Optimize with useCallback for event handlers
- Add responsive design for mobile devices
