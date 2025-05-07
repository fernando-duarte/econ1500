# Socket.IO Refactor & Best Practices Plan

This document lays out a comprehensive, step-by-step plan to clean up the real-time socket setup, remove duplication, enforce strong typing, and introduce industry best practices. Follow each sub-step in order. Even a junior developer can implement these changes by copying & pasting the code snippets.

---

## 1) Remove the placeholder `/api/socket` route

**Why:** The App Router API at `app/api/socket/route.ts` only returns a JSON health-check and does _not_ handle real Socket.IO connections. It confuses developers into thinking it's part of the real-time layer.

Sub-steps:

1. **Delete** the file:
   - Path: `app/api/socket/route.ts`
   - No code needs to be pasted—just remove the file entirely.

```bash
# From project root
git rm app/api/socket/route.ts
```

2. **Update** `middleware.ts` to stop matching `/api/socket`:
   - In `middleware.ts`, find `config.matcher` and ensure `/api/socket` (or any socket health path) is _not_ included.

Before (`middleware.ts`):

```ts
export const config = {
  matcher: ["/", "/game/:path*", "/api/auth/logout", "/api/socket"],
};
```

After (`middleware.ts`):

```ts
export const config = {
  matcher: ["/", "/game/:path*", "/api/auth/logout"],
};
```

---

## 2) Centralize Socket.IO under a single, configurable path

**Why:** Relying on the default `/socket.io` without explicit configuration can break behind proxies or new deployments. We'll namespace it under `/api/ws` and lock down CORS to the official front-end URL, https://www.econ1500.org.

Sub-steps:

1. **Open** `lib/socket/server.ts`.
2. **Modify** the `new SocketIOServer(...)` call to include `path` and concrete CORS options.

Before (`lib/socket/server.ts` around line 22):

```ts
export function initSocketIO(httpServer: HTTPServer) {
  if (!io) {
-    io = new SocketIOServer(httpServer, {
-      path: "/api/ws",
-      cors: {
-        origin: process.env.NEXT_PUBLIC_WS_ORIGIN || "*",
+    io = new SocketIOServer(httpServer, {
+      path: "/api/ws",
+      cors: {
+        origin: process.env.NEXT_PUBLIC_WS_ORIGIN || "https://www.econ1500.org",
         methods: ["GET", "POST"]
       }
     });
```

3. **Open** `lib/socket/client.ts`.
4. **Modify** the `io()` call to match the new path and enable reconnection options.

Before (`lib/socket/client.ts` around line 10):

```ts
export function getSocket(): Socket {
  if (!socket) {
-    socket = io();
+    socket = io(undefined, {
+      path: "/api/ws",
+      transports: ["websocket"],
+      autoConnect: true,
+      reconnection: true,
+      reconnectionAttempts: 5,
+      auth: {
+        // sessionId will be set later via SocketProvider
+      }
+    });
```

---

## 3) Remove the `globalThis.io` hack

**Why:** Attaching the socket instance to `globalThis` is brittle and bypasses module boundaries. We'll rely on a singleton pattern instead.

Sub-steps:

1. **In** `lib/socket/server.ts`, **delete** the `// @ts-ignore` line and the `globalThis.io = io;` assignment.

Before:

```ts
// @ts-ignore - This is a workaround for Next.js App Router
globalThis.io = io;
```

After (removed both lines):

```ts
// (no globalThis hack)
```

---

## 4) Strongly type your socket events

**Why:** Explicit event interfaces catch mismatches at compile time on both server and client.

Sub-steps:

1. **Create** a new events file:
   - Path: `lib/socket/events.ts`
   - Contents:

```ts
// lib/socket/events.ts
import type { Controls, State } from "@/lib/game/types";

export interface ClientToServerEvents {
  join: (sessionId: string) => void;
  "submit-round": { sessionId: string; controls: Controls };
}

export interface ServerToClientEvents {
  state: (history: State[]) => void;
}
```

2. **Update** the server initialization to use generics:

Before (`lib/socket/server.ts`):

```ts
io = new SocketIOServer(httpServer, {
  /* ... */
});
```

After:

```ts
import type { ClientToServerEvents, ServerToClientEvents } from "./events";

io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  path: "/api/ws",
  cors: {
    /* ... */
  },
});
```

3. **Update** the client to use the same generics:

Before (`lib/socket/client.ts`):

```ts
socket = io(undefined, {
  /* options */
});
```

After:

```ts
import type { ServerToClientEvents, ClientToServerEvents } from "./events";

socket = io<ServerToClientEvents, ClientToServerEvents>(undefined, {
  /* same options */
});
```

---

## 5) Migrate session storage to Redis for horizontal scalability

**Why:** In-memory `sessions: Record<string, State[]>` will not sync across multiple Node processes. We'll use Redis so all instances share the same store, with schema validation and key expiry.

Sub-steps:

1. **Install** the Redis adapter:

```bash
npm install redis @socket.io/redis-adapter zod
```

2. **Create** a session-store utility:
   - File: `lib/socket/sessionStore.ts`

```ts
// lib/socket/sessionStore.ts
import { createClient } from "redis";
import { z } from "zod";
import type { State } from "@/lib/game/types";

// Define Zod schemas matching your State interface
const StateSchema = z.object({
  year: z.number(),
  K: z.number(),
  L: z.number(),
  A: z.number(),
  Y: z.number(),
  X: z.number(),
  M: z.number(),
  NX: z.number(),
  openness: z.number(),
  C: z.number(),
  I: z.number(),
  e: z.number(),
});
const HistorySchema = z.array(StateSchema);

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();
```

3. **Enhance** history retrieval and TTL:
   - In `lib/socket/sessionStore.ts`, **replace** the existing `getHistory` and `setHistory` functions (or insert immediately after the `redisClient.connect()` call) with the following:

```ts
// lib/socket/sessionStore.ts (replace these functions)
export async function getHistory(sessionId: string): Promise<State[] | null> {
  const json = await redisClient.get(`session:${sessionId}`);
  if (!json) return null;
  const parsed = JSON.parse(json);
  const result = HistorySchema.safeParse(parsed);
  if (!result.success) {
    console.warn(`Invalid session data for ${sessionId}, resetting`);
    await redisClient.del(`session:${sessionId}`);
    return null;
  }
  return result.data;
}

export async function setHistory(sessionId: string, history: State[]): Promise<void> {
  await redisClient.set(`session:${sessionId}`, JSON.stringify(history));
  const ttl = Number(process.env.SESSION_TTL) || 86400;
  await redisClient.expire(`session:${sessionId}`, ttl);
}
```

4. **Wire up** Redis adapter for Socket.IO:
   In `lib/socket/server.ts`, inside `initSocketIO` right after `io = new SocketIOServer(...)`, add:

```ts
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
await pubClient.connect();
await subClient.connect();
io.adapter(createAdapter(pubClient, subClient));
```

5. **Replace** in-memory `sessions` logic with calls to `getHistory` / `setHistory`:

Before (in `lib/socket/server.ts`):

```ts
const sessions: Record<string, State[]> = {};

socket.on("join", (sessionId) => {
  if (!sessions[sessionId]) {
    sessions[sessionId] = [growthModel.initialState];
  }
  socket.join(sessionId);
  socket.emit("state", sessions[sessionId]);
});
```

After:

```ts
import { getHistory, setHistory } from "./sessionStore";

socket.on("join", async (sessionId) => {
  let history = await getHistory(sessionId);
  if (!history) {
    history = [growthModel.initialState];
    await setHistory(sessionId, history);
  }
  socket.join(sessionId);
  socket.emit("state", history!);
});
```

In the same file `lib/socket/server.ts`, **replace** the existing `socket.on("submit-round", ...)` handler (the old synchronous version) with an async version using `getHistory`/`setHistory`:

```ts
// lib/socket/server.ts (old submit-round handler)
socket.on("submit-round", ({ sessionId, controls }: { sessionId: string; controls: Controls }) => {
  const history = sessions[sessionId];
  if (!history || history.length === 0) return;
  const prev = history[history.length - 1];
  if (!prev) return;
  const currentIndex = growthModel.exogenous.findIndex((e) => e.year === prev.year);
  const nextIndex = Math.min(currentIndex + 1, growthModel.exogenous.length - 1);
  const exog = growthModel.exogenous[nextIndex];
  if (!exog) return;
  const next = runRound(prev, controls, exog);
  history.push(next);
  io.to(sessionId).emit("state", history);
});

// lib/socket/server.ts (new async submit-round handler)
import { getHistory, setHistory } from "./sessionStore";

socket.on(
  "submit-round",
  async ({ sessionId, controls }: { sessionId: string; controls: Controls }) => {
    let history = (await getHistory(sessionId)) || [growthModel.initialState];
    const prev = history[history.length - 1]!;
    const currentIndex = growthModel.exogenous.findIndex((e) => e.year === prev.year);
    const nextIndex = Math.min(currentIndex + 1, growthModel.exogenous.length - 1);
    const exog = growthModel.exogenous[nextIndex];
    if (!exog) return;
    const nextState = runRound(prev, controls, exog);
    history.push(nextState);
    await setHistory(sessionId, history);
    io.to(sessionId).emit("state", history);
  }
);
```

---

## 6) Introduce a React Context `SocketProvider`

**Why:** Developers shouldn't misuse the raw socket. We'll expose only the methods the UI needs, with correct hook dependencies.

Sub-steps:

1. **Create** `components/providers/SocketProvider.tsx`.

```tsx
// components/providers/SocketProvider.tsx
"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import type { Controls } from "@/lib/game/types";

/** Exposed minimal socket API for the UI */
interface SocketApi {
  join: (sessionId: string) => void;
  onState: (cb: (history: State[]) => void) => void;
  submitRound: (controls: Controls) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketApi | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [api, setApi] = useState<SocketApi | null>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    const socket = getSocket();
    const saved = localStorage.getItem("sessionId");
    const id = saved || `sess_${socket.id}`;
    localStorage.setItem("sessionId", id);
    sessionIdRef.current = id;

    // Build and provide only the methods the UI needs
    const socketApi: SocketApi = {
      join: (sid) => socket.emit("join", sid),
      onState: (cb) => socket.on("state", cb),
      submitRound: (controls) => socket.emit("submit-round", { sessionId: id, controls }),
      disconnect: () => socket.disconnect(),
    };

    setApi(socketApi);
    socket.emit("join", id);
    socket.on("reconnect", () => socket.emit("join", id));

    return () => {
      socket.off("state");
      socket.disconnect();
    };
  }, []); // only run once

  if (!api) return null;
  return <SocketContext.Provider value={api}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
}
```

2. **Wrap** your game UI in this provider:
   - In `app/game/page.tsx`, at the top of the component, replace:

Before:

```tsx
// Inside default export function GamePage()
<AuthenticatedLayout>{/* ... */}</AuthenticatedLayout>
```

After:

```tsx
<AuthenticatedLayout>
  <SocketProvider>{/* existing game UI goes here unchanged */}</SocketProvider>
</AuthenticatedLayout>
```

3. **Refactor** direct `getSocket()` calls in **`app/game/page.tsx`** to use `useSocket()`:

**Step A – Update imports**
In `app/game/page.tsx`, at the very top, replace:

```diff
- import { getSocket } from "@/lib/socket";
+ import { useSocket } from "@/components/providers/SocketProvider";
```

**Step B – Rewrite the `useEffect`**
Find and **replace** the existing `useEffect` block:

```tsx
// BEFORE – app/game/page.tsx
useEffect(() => {
  const socket = getSocket();
  const sessionId = `sess_${socket.id}`;

  socket.emit("join", sessionId);
  socket.on("state", (h) => setHistory(h));

  return () => {
    socket.off("state");
  };
}, []);
```

With:

```tsx
// AFTER – app/game/page.tsx
const socketApi = useSocket();

useEffect(() => {
  socketApi.onState((h) => setHistory(h));
}, []);
```

**Step C – Update `handleSubmit`**
Locate the `handleSubmit` function and **replace** its body:

```diff
// BEFORE – app/game/page.tsx
function handleSubmit(controls: ControlsType) {
  const socket = getSocket();
  const sessionId = `sess_${socket.id}`;

  setLiveControls(controls);
  socket.emit("submit-round", { sessionId, controls });
}

// AFTER – app/game/page.tsx
function handleSubmit(controls: ControlsType) {
  setLiveControls(controls);
  socketApi.submitRound(controls);
}
```

---

## 7) Add reconnect & error-handling UI

**Why:** If the socket disconnects, the user should see a banner and we should attempt automatic reconnection.

Sub-steps:

1. **Inside** `SocketProvider`, after `sock.emit("join", ...)`, add:

```ts
sock.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
  // TODO: set React state to display a banner in your layout
});
sock.on("reconnect_attempt", (attempt) => {
  console.log(`Reconnecting, attempt #${attempt}`);
});
sock.on("reconnect_failed", () => {
  // TODO: inform user reconnection failed
});
```

2. **Expose** a small React hook or context value telling consumers if the socket is `connected`, `connecting`, or `disconnected`. Use that in `AuthenticatedLayout` or a global banner.

---

## 8) Move to a stable session-ID handshake

**Why:** If the client reconnects, `socket.id` changes, so they can lose their game session. We'll generate a permanent `sessionId` at login.

Sub-steps:

1. **Install** a UUID library:

```bash
npm install uuid
```

2. **Modify** the login API at `app/api/auth/login/route.ts`:
   - After validating `username`, import and generate a `sessionId`, return it in the JSON.

Before:

```ts
// response body
NextResponse.json({ success: true, username });
```

After:

```ts
import { v4 as uuidv4 } from "uuid";

const sessionId = uuidv4();
const response = NextResponse.json({ success: true, username, sessionId });
```

3. **Store** that `sessionId` in localStorage in the login page or wherever you handle the POST response.

4. **Pass** that `sessionId` into your `SocketProvider` via props or React state, instead of using `sock.id`.

---

## 9) Clean up routing strategy

**Recommended**: _Fully Custom Node Server_

1. Keep your existing `server.js` and custom Next.js server with Socket.IO.
2. Remove any App Router API routes under `app/api` that handle real-time.
3. Move `auth` endpoints into `pages/api/auth/*` so Next.js's built-in API routing handles them.
4. Ensure `next.config.js` has no conflicting App Router API endpoints.

---

## 10) Final housekeeping & documentation

1. **Update** `README.md` to reflect the new `/api/ws` path, requirements for `REDIS_URL`, `NEXT_PUBLIC_WS_ORIGIN`, and `SESSION_TTL`, and how to start the custom server:
   ```bash
   REDIS_URL=redis://localhost:6379 npm run dev-server
   ```
2. **Add** environment‐variable checks for `REDIS_URL`, `NEXT_PUBLIC_WS_ORIGIN`, and `SESSION_TTL` in `middleware.ts` or startup logic, logging warnings if missing.
3. **Add** graceful shutdown to `server.js`:

```js
// at bottom of server.js
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("Shutting down...");
  io.close();
  server.close(() => process.exit(0));
}
```

4. **Add** a sample environment file:

```yaml
# .env.example
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_WS_ORIGIN=https://www.econ1500.org
SESSION_TTL=86400
```

---

**By following these 10 major steps, you will**:

- Eliminate confusing duplicate routes
- Adopt one clear, configurable real-time endpoint
- Enforce compile-time safety via typed events
- Scale horizontally with Redis-backed sessions (with validation & TTL)
- Encapsulate your socket logic in a minimal React Context API
- Provide robust reconnect and error UI
- Issue a stable session ID that survives reconnects and page loads
- Have a single, coherent routing strategy using your custom server
- Support graceful shutdown in production

Congratulations! After this refactor, onboarding new developers and operating in production will be significantly smoother.
