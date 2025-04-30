## Phase 3: Real-Time Communication

### Step 3.1: Socket.IO Server Setup

**Before:**
No Socket.IO integration exists.

**After:**

```typescript
// app/api/socket/route.ts
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { Server as ServerIO } from "socket.io";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Game session schema for validation
const gameSessionSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  hostName: z.string(),
  players: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isConnected: z.boolean().default(true),
      joinedAt: z.number(),
    })
  ),
  playerCount: z.number(),
  status: z.enum(["waiting", "active", "completed"]),
  createdAt: z.number(),
  version: z.number().default(0),
});

// Game sessions storage with Map for O(1) lookups
const gameSessions = new Map();
// Track socket ID to student ID for connection management
const socketToStudentMap = new Map();

export async function GET(req: NextRequest) {
  try {
    if ((global as any).io) {
      return NextResponse.json({ success: true });
    }

    // Create HTTP server
    const res = new NextResponse();
    const requestAsNextApiRequest = req as unknown as NextApiRequest;
    const responseAsNetServer = res as unknown as NetServer;

    const io = new ServerIO(responseAsNetServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      connectionStateRecovery: {
        // Enable state recovery for reconnections
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
      },
    });

    (global as any).io = io;

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // Send active games to newly connected client
      socket.emit("active-games", Array.from(gameSessions.values()));

      // Handle authentication
      socket.on("authenticate", ({ studentId, displayName }) => {
        // Associate socket with student
        socketToStudentMap.set(socket.id, studentId);

        // Find all games the student is in and mark them as connected
        gameSessions.forEach((game) => {
          const playerIndex = game.players.findIndex((p) => p.id === studentId);
          if (playerIndex >= 0) {
            game.players[playerIndex].isConnected = true;
            socket.join(game.id);
            game.version++;
            io.to(game.id).emit("game-state", game);
          }
        });
      });

      // Handle game creation
      socket.on("create-game", ({ hostId, hostName }) => {
        const gameId = generateUniqueId();

        const newGame = {
          id: gameId,
          hostId,
          hostName,
          players: [
            {
              id: hostId,
              name: hostName,
              isConnected: true,
              joinedAt: Date.now(),
            },
          ],
          playerCount: 1,
          status: "waiting",
          createdAt: Date.now(),
          version: 0,
        };

        // Validate game session
        try {
          gameSessionSchema.parse(newGame);
          gameSessions.set(gameId, newGame);

          socket.join(gameId);
          socket.emit("game-created", gameId);
          io.emit("active-games", Array.from(gameSessions.values()));
        } catch (error) {
          console.error("Invalid game session data:", error);
          socket.emit("error", { message: "Could not create game." });
        }
      });

      // Handle player joining game
      socket.on("join-game", ({ gameId, studentId, displayName }) => {
        const gameSession = gameSessions.get(gameId);

        if (gameSession) {
          // Add player to game session if not already there
          const existingPlayerIndex = gameSession.players.findIndex((p) => p.id === studentId);

          if (existingPlayerIndex >= 0) {
            // Player rejoining
            gameSession.players[existingPlayerIndex].isConnected = true;
          } else {
            // New player
            gameSession.players.push({
              id: studentId,
              name: displayName,
              isConnected: true,
              joinedAt: Date.now(),
            });
            gameSession.playerCount = gameSession.players.length;
          }

          socket.join(gameId);
          gameSession.version++;
          io.to(gameId).emit("player-joined", { id: studentId, name: displayName });
          io.to(gameId).emit("game-state", gameSession);
          io.emit("active-games", Array.from(gameSessions.values()));
        } else {
          socket.emit("game-not-found");
        }
      });

      // Handle game state updates
      socket.on("game-update", ({ gameId, gameState, version }) => {
        const currentGame = gameSessions.get(gameId);

        if (currentGame && version === currentGame.version) {
          // Only update if versions match to prevent conflicts
          try {
            const validatedState = gameSessionSchema.parse(gameState);
            validatedState.version++;
            gameSessions.set(gameId, validatedState);
            io.to(gameId).emit("game-state", validatedState);
          } catch (error) {
            console.error("Invalid game state update:", error);
            socket.emit("error", { message: "Invalid game state." });
            socket.emit("game-state", currentGame); // Send current state back
          }
        } else if (currentGame) {
          // Version mismatch, send current state
          socket.emit("version-mismatch", { currentVersion: currentGame.version });
          socket.emit("game-state", currentGame);
        }
      });

      // Handle player leaving game
      socket.on("leave-game", ({ gameId, studentId }) => {
        const gameSession = gameSessions.get(gameId);

        if (gameSession) {
          const playerIndex = gameSession.players.findIndex((p) => p.id === studentId);

          if (playerIndex >= 0) {
            gameSession.players[playerIndex].isConnected = false;
            socket.leave(gameId);

            gameSession.version++;
            io.to(gameId).emit("player-left", { id: studentId });
            io.to(gameId).emit("game-state", gameSession);
            io.emit("active-games", Array.from(gameSessions.values()));

            // If host left and no other players, remove game
            if (
              gameSession.hostId === studentId &&
              !gameSession.players.some((p) => p.isConnected && p.id !== studentId)
            ) {
              gameSessions.delete(gameId);
              io.emit("active-games", Array.from(gameSessions.values()));
            }
          }
        }
      });

      // Handle get game state request
      socket.on("get-game-state", ({ gameId }) => {
        const gameSession = gameSessions.get(gameId);

        if (gameSession) {
          socket.emit("game-state", gameSession);
        } else {
          socket.emit("game-not-found");
        }
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);

        // Get student ID associated with this socket
        const studentId = socketToStudentMap.get(socket.id);

        if (studentId) {
          // Update player connection status in all games
          gameSessions.forEach((game) => {
            const playerIndex = game.players.findIndex((p) => p.id === studentId);

            if (playerIndex >= 0) {
              game.players[playerIndex].isConnected = false;
              game.version++;
              io.to(game.id).emit("player-disconnected", { id: studentId });
              io.to(game.id).emit("game-state", game);
              io.emit("active-games", Array.from(gameSessions.values()));
            }
          });

          // Remove from socket map
          socketToStudentMap.delete(socket.id);
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Socket setup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 9);
}
```

**Implementation Details:**

- Add Zod schema validation for game sessions
- Include version tracking for optimistic updates
- Implement socket to student mapping for connection management
- Add connection state recovery for reconnections
- Implement proper cleanup on disconnections
- Add version mismatch handling to prevent conflicts

### Step 3.2: Socket.IO Client Integration

**Before:**
No client-side socket management exists.

**After:**

```typescript
// lib/socket/hooks.ts
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/lib/auth/context";

// Singleton socket instance
let socketInstance: Socket | null = null;

export function useSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const reconnectAttemptRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Initialize socket or return existing instance
  const initializeSocket = useCallback(() => {
    if (!socketInstance) {
      // Initialize connection
      fetch("/api/socket");
      socketInstance = io({
        path: "/api/socket/io",
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });
    }

    return socketInstance;
  }, []);

  useEffect(() => {
    const socket = initializeSocket();

    // Set up event listeners
    const onConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
      setLastError(null);
      reconnectAttemptRef.current = 0;

      // Authenticate socket with user info
      if (user) {
        socket.emit("authenticate", {
          studentId: user.studentId,
          displayName: user.displayName || user.studentId,
        });
      }
    };

    const onDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    };

    const onError = (error: Error) => {
      console.error("Socket error:", error);
      setLastError(error.message);
    };

    const onReconnectAttempt = (attempt: number) => {
      console.log(`Reconnection attempt ${attempt}`);
      reconnectAttemptRef.current = attempt;
    };

    const onReconnectFailed = () => {
      console.log("Reconnection failed");
      setLastError("Connection failed after multiple attempts. Please refresh the page.");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("reconnect_attempt", onReconnectAttempt);
    socket.on("reconnect_failed", onReconnectFailed);

    // Check if already connected
    if (socket.connected) {
      setIsConnected(true);
      // Authenticate on initial connection
      if (user) {
        socket.emit("authenticate", {
          studentId: user.studentId,
          displayName: user.displayName || user.studentId,
        });
      }
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("reconnect_attempt", onReconnectAttempt);
      socket.off("reconnect_failed", onReconnectFailed);
      // Don't disconnect, keep socket alive for app lifetime
    };
  }, [initializeSocket, user]);

  // Re-authenticate when user changes
  useEffect(() => {
    if (isConnected && user && socketInstance) {
      socketInstance.emit("authenticate", {
        studentId: user.studentId,
        displayName: user.displayName || user.studentId,
      });
    }
  }, [isConnected, user]);

  return {
    socket: socketInstance,
    isConnected,
    lastError,
    reconnectAttempt: reconnectAttemptRef.current,
  };
}
```

**Implementation Details:**

- Implement singleton pattern to prevent duplicate connections
- Add reconnection strategy with attempt tracking
- Add socket re-authentication when user changes
- Include error handling and state reporting
- Keep socket alive across page navigation
- Optimize event listener cleanup
