## Phase 8: Error Handling Components

### Step 8.1: Not Found Page

**Before:**
No custom 404 page exists.

**After:**

```typescript
// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </main>
  );
}
```

**Implementation Details:**

- Create custom 404 page with clear message
- Add button to return to home page
- Use centered layout with responsive design
- Include proper heading hierarchy for accessibility
- Apply consistent styling with UI components

### Step 8.2: Error Page

**Before:**
No custom error page exists.

**After:**

```typescript
// app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-8 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            Return to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
```

**Implementation Details:**

- Create client-side error boundary page
- Add error logging for monitoring
- Include reset functionality to try recovery
- Add fallback to return to home page
- Use consistent styling with UI components
- Implement responsive layout for all devices

## Phase 9: Performance Optimizations

### Step 9.1: Socket Connection Optimizations

**Before:**
Basic socket connection without optimizations.

**After:**

```typescript
// lib/socket/config.ts
// Socket.IO configuration constants and utilities

export const SOCKET_CONFIG = {
  // Path for Socket.IO connection
  path: "/api/socket/io",

  // Reconnection settings
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,

  // Timeout settings
  timeout: 20000,

  // Performance settings
  transports: ["websocket", "polling"],
  upgradeTimeout: 10000,

  // Buffer settings
  rememberUpgrade: true,
};

// Selective update helpers
export function createDiff(oldState: any, newState: any) {
  if (!oldState) return newState;

  const diff: Record<string, any> = {};
  let hasDiff = false;

  Object.keys(newState).forEach((key) => {
    if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
      diff[key] = newState[key];
      hasDiff = true;
    }
  });

  return hasDiff ? diff : null;
}

// Version management
export function isNewerVersion(current: number, incoming: number): boolean {
  return incoming > current;
}

// Selective event emissions to reduce network traffic
export function emitGameUpdate(socket: any, gameId: string, fullState: any, prevState: any) {
  const diff = createDiff(prevState, fullState);

  if (diff) {
    socket.emit("game-update-diff", {
      gameId,
      diff,
      version: fullState.version,
    });
  }
}
```

**Implementation Details:**

- Centralize socket configuration parameters
- Implement selective updates with diff generation
- Add version management helpers
- Create optimized event emission functions
- Configure optimal transports for different environments

### Step 9.2: React Optimizations

**Before:**
Standard React components without optimizations.

**After:**

```typescript
// components/optimized/PlayersList.tsx
"use client";

import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";

// Player type definition
type Player = {
  id: string;
  name: string;
  isConnected?: boolean;
  isHost?: boolean;
  isCurrentTurn?: boolean;
  joinedAt?: number;
};

interface PlayersListProps {
  players: Player[];
  currentUserId?: string;
  currentTurn?: string;
  hostId?: string;
}

// Memoized individual player component
const PlayerItem = memo(({
  player,
  isCurrentUser,
  isHost,
  isCurrentTurn,
}: {
  player: Player;
  isCurrentUser: boolean;
  isHost: boolean;
  isCurrentTurn: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`flex items-center justify-between rounded border p-2 ${
              !player.isConnected ? "opacity-50 bg-muted/50" : ""
            } ${
              isCurrentTurn ? "border-primary bg-primary/10" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${player.isConnected ? "bg-green-500" : "bg-gray-400"}`}></div>
              <p className="font-medium truncate max-w-[120px]">
                {player.name}
                {isCurrentUser && " (You)"}
              </p>
            </div>
            {isHost && (
              <Badge variant="outline" className="ml-1 text-xs">Host</Badge>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{player.isConnected ? "Online" : "Offline"}</p>
          {isHost && <p>Game Host</p>}
          {isCurrentTurn && <p>Current Turn</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
PlayerItem.displayName = "PlayerItem";

// Memoized players list component
export const PlayersList = memo(function PlayersList({
  players,
  currentUserId,
  currentTurn,
  hostId,
}: PlayersListProps) {
  // Sort players: host first, then by join time
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      // Host always first
      if (a.id === hostId) return -1;
      if (b.id === hostId) return 1;

      // Current user second
      if (a.id === currentUserId) return -1;
      if (b.id === currentUserId) return 1;

      // Then by join time
      return (a.joinedAt || 0) - (b.joinedAt || 0);
    });
  }, [players, hostId, currentUserId]);

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {sortedPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            player={player}
            isCurrentUser={player.id === currentUserId}
            isHost={player.id === hostId}
            isCurrentTurn={player.id === currentTurn}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
```

**Implementation Details:**

- Use React.memo for component memoization
- Implement useMemo for expensive calculations
- Create optimized animations with AnimatePresence
- Split components for granular rendering optimization
- Use proper displayName for debugging
- Apply sorting and filtering optimizations
