# Real-Time Multiplayer Game Architecture with Next.js and Shadcn UI

## Overview

This architecture supports multiple students logging in individually to play together in shared game sessions, with real-time updates and synchronization across devices. It allows for multiple concurrent game sessions and supports both single and multi-player modes.

## Core Architecture Components

### 1. Server-Side Components (Next.js App Router)

- **Homepage Container**: Server component that conditionally renders login or game content
- **Game Session Manager**: Handles creation, joining, and tracking of game sessions
- **Student Roster Service**: Stores and retrieves student data
- **WebSocket Integration**: Socket.IO server implementation for real-time communication

### 2. Client-Side Components (Shadcn UI)

- **Login Form**: Client component with Combobox for student selection
- **Display Name Input**: Optional field for custom display names
- **Game Lobby**: Interface for creating/joining game sessions
- **Game UI**: Interactive game components with real-time updates
- **Player Presence Indicators**: Shows who's currently in the game

### 3. Real-Time Communication Layer

- **Socket.IO Integration**: WebSocket management for live updates
- **Channel Management**: Multiple channels for different game sessions
- **Event System**: Broadcasting game state changes and player actions
- **Connection Management**: Handling reconnections and disconnects

### 4. State Management

- **Authentication State**: Client-side storage for login information
- **Game State**: Server-maintained state synchronized to clients
- **UI State**: React state hooks controlling Shadcn UI components
- **Presence Data**: Real-time player status information

## Implementation Flow

### Student Login Process

```tsx
// app/page.tsx (Server Component)
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto w-full max-w-md">
        {/* Client components rendered conditionally */}
        <LoginForm />
        {/* Game content rendered after login */}
      </div>
    </main>
  );
}

// components/LoginForm.tsx (Client Component)
("use client");

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn UI components
import {
  Card,
  CardHeader,
  CardContent,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Combobox,
  Input,
  Button,
} from "@/components/ui";

// Form validation
const formSchema = z.object({
  studentId: z.string({
    required_error: "Please select your name from the list.",
  }),
  displayName: z.string().optional(),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      displayName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Store login info
    localStorage.setItem("studentId", values.studentId);
    localStorage.setItem("displayName", values.displayName || "");

    // Navigate to game lobby
    router.push("/lobby");

    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-center text-2xl font-bold">Welcome</h2>
        <p className="text-muted-foreground text-center">Find your name to begin</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Student selection combobox */}
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Combobox
                      options={students.map((student) => ({
                        label: student.name,
                        value: student.id,
                      }))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display name input */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="How you want to be called in the game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Start Game"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

### Game Session Management

```tsx
// app/lobby/page.tsx (Server Component)
import { GameLobby } from "@/components/GameLobby";

export default function LobbyPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="mx-auto w-full max-w-4xl">
        <GameLobby />
      </div>
    </main>
  );
}

// components/GameLobby.tsx (Client Component)
("use client");

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";

export function GameLobby() {
  const router = useRouter();
  const [activeGames, setActiveGames] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Initialize socket connection
    fetch("/api/socket");
    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("active-games", (games) => {
      setActiveGames(games);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const createNewGame = () => {
    socket.emit("create-game", {
      hostId: localStorage.getItem("studentId"),
      hostName:
        localStorage.getItem("displayName") || getStudentName(localStorage.getItem("studentId")),
    });

    socket.once("game-created", (gameId) => {
      router.push(`/game/${gameId}`);
    });
  };

  const joinGame = (gameId) => {
    socket.emit("join-game", {
      gameId,
      studentId: localStorage.getItem("studentId"),
      displayName:
        localStorage.getItem("displayName") || getStudentName(localStorage.getItem("studentId")),
    });

    router.push(`/game/${gameId}`);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Game Lobby</h2>
        <p className="text-muted-foreground">Create a new game or join an existing one</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <Button onClick={createNewGame} className="w-full">
            Create New Game
          </Button>

          {activeGames.length > 0 ? (
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">Active Games</h3>
              <div className="space-y-2">
                {activeGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <p className="font-medium">{game.hostName}'s Game</p>
                      <p className="text-muted-foreground text-sm">{game.playerCount} players</p>
                    </div>
                    <Button variant="outline" onClick={() => joinGame(game.id)}>
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              No active games. Create one to start playing!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

### WebSocket Integration

```typescript
// pages/api/socket.js
import { Server } from "socket.io";

// In-memory game session storage (replace with database for production)
const gameSessions = new Map();

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    // Socket.IO server already running
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    // Send active games to newly connected clients
    socket.emit("active-games", Array.from(gameSessions.values()));

    // Handle game creation
    socket.on("create-game", ({ hostId, hostName }) => {
      const gameId = generateUniqueId();

      gameSessions.set(gameId, {
        id: gameId,
        hostId,
        hostName,
        players: [{ id: hostId, name: hostName }],
        playerCount: 1,
        status: "waiting",
        createdAt: new Date(),
      });

      socket.join(gameId);
      socket.emit("game-created", gameId);
      io.emit("active-games", Array.from(gameSessions.values()));
    });

    // Handle joining a game
    socket.on("join-game", ({ gameId, studentId, displayName }) => {
      const gameSession = gameSessions.get(gameId);

      if (gameSession) {
        // Add player to game session
        gameSession.players.push({ id: studentId, name: displayName });
        gameSession.playerCount = gameSession.players.length;

        // Join socket room
        socket.join(gameId);

        // Notify all players in the game
        io.to(gameId).emit("player-joined", { id: studentId, name: displayName });
        io.emit("active-games", Array.from(gameSessions.values()));
      }
    });

    // Handle game state updates
    socket.on("game-update", ({ gameId, gameState }) => {
      io.to(gameId).emit("game-state", gameState);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Handle player leaving games
      // Update active game sessions
    });
  });

  res.end();
}

function generateUniqueId() {
  return Math.random().toString(36).substring(2, 9);
}
```

## Architecture Benefits

1. **Scalability**: Multiple concurrent game sessions with isolated state
2. **Real-time Interaction**: Immediate updates across all connected clients
3. **Consistent UI**: Shadcn UI components for a polished user experience
4. **Flexible Gameplay**: Support for single or multiplayer sessions
5. **Responsive Design**: Works across desktop and mobile devices
6. **Type Safety**: TypeScript and Zod validation throughout

## Technical Considerations

1. **Authentication**: Simple name selection with optional display name
2. **State Persistence**: Game state maintained on server with client synchronization
3. **Error Handling**: Graceful handling of disconnections and reconnections
4. **Performance**: Optimized data transfer with selective updates
5. **Accessibility**: Shadcn UI components with proper ARIA attributes
6. **SEO**: Server components for improved indexing and initial load

## Development Roadmap

1. Implement student login with Shadcn UI components
2. Create Socket.IO integration for real-time communication
3. Build game lobby interface for session management
4. Develop core game mechanics with synchronized state
5. Add player presence and status indicators
6. Implement game completion and results tracking
7. Add administrative features for teachers/instructors
