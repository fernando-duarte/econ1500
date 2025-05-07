import { createServer } from "http";
// import { parse } from "url"; // No longer needed
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { growthModel } from "./lib/constants"; // Adjusted path
import { runRound } from "./lib/game/engine"; // Adjusted path
import type { Controls, State } from "./lib/game/types"; // Adjusted path

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Define a type for the server with socket.io
// This global declaration allows us to attach io to the HttpServer instance
declare module "http" {
  interface Server {
    io?: SocketIOServer;
  }
}

const sessions: Record<string, State[]> = {};

app.prepare().then(() => {
  // Pass the Next.js request handler directly to createServer
  const httpServer = createServer(handle);

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket_io", // This matches your client-side configuration
    // Optional: Add CORS configuration if your client is on a different domain/port during development
    // cors: {
    //   origin: "*", // Adjust for production
    //   methods: ["GET", "POST"]
    // }
  });

  // Attach io to the httpServer instance so it can be potentially accessed elsewhere if needed,
  // though typically all socket logic will be within this server.ts
  httpServer.io = io;

  io.on("connection", (socket) => {
    console.log(`[SERVER] Client connected: ${socket.id}`);

    socket.on("join", (sessionId: string) => {
      console.log(`[SERVER] Client ${socket.id} attempting to join session: ${sessionId}`);
      if (!sessions[sessionId]) {
        console.log(
          `[SERVER] New session created for ${sessionId}. Initializing with:`,
          growthModel.initialState
        );
        sessions[sessionId] = [growthModel.initialState];
      } else {
        console.log(
          `[SERVER] Session ${sessionId} already exists for client ${socket.id}. Current history length: ${sessions[sessionId].length}`
        );
      }
      socket.join(sessionId);
      console.log(
        `[SERVER] Client ${socket.id} joined room ${sessionId}. Emitting current state to this client.`
      );
      socket.emit("state", sessions[sessionId]);
    });

    socket.on(
      "submit-round",
      ({ sessionId, controls }: { sessionId: string; controls: Controls }) => {
        console.log(
          `[SERVER] Received 'submit-round' for session: ${sessionId} from socket ${socket.id}. Controls:`,
          controls
        );
        const history = sessions[sessionId];

        if (!history || history.length === 0) {
          console.error(
            `[SERVER] No history found for session ${sessionId}. Current active session IDs:`,
            Object.keys(sessions)
          );
          socket.emit("error", { message: `No history found for session ${sessionId}` }); // Send error back to client
          return;
        }
        console.log(`[SERVER] Found history for session ${sessionId}. Length: ${history.length}`);

        const prev = history[history.length - 1];
        const exogIndex = Math.min(history.length - 1, growthModel.exogenous.length - 1);
        const exog = growthModel.exogenous[exogIndex];

        if (!prev) {
          console.error(
            `[SERVER] 'prev' state is undefined for session ${sessionId}. Full history:`,
            history
          );
          socket.emit("error", { message: `Previous state is missing for session ${sessionId}` });
          return;
        }
        if (!exog) {
          console.error(`[SERVER] 'exog' data is undefined for exogIndex ${exogIndex}.`);
          socket.emit("error", { message: `Exogenous data is missing for exogIndex ${exogIndex}` });
          return;
        }

        console.log(
          `[SERVER] Calling runRound for session ${sessionId}. Prev state year: ${prev.year}, Controls:`,
          controls,
          `Exog year: ${exog.year}`
        );
        try {
          const next = runRound(prev, controls, exog);
          console.log(
            `[SERVER] runRound completed for session ${sessionId}. Next state year: ${next.year}`
          );

          history.push(next);
          console.log(
            `[SERVER] Emitting 'state' to room ${sessionId}. New history length: ${history.length}.`
          );
          // Emitting the updated history to all clients in the session room
          io.to(sessionId).emit("state", history);
        } catch (error) {
          console.error(
            `[SERVER] Error during runRound or state emission for session ${sessionId}:`,
            error
          );
          socket.emit("error", { message: `Error processing round for session ${sessionId}` });
        }
      }
    );

    socket.on("disconnect", (reason) => {
      console.log(`[SERVER] Client ${socket.id} disconnected. Reason: ${reason}`);
      // Optional: Implement session cleanup or persistence logic here if needed
      // For example, find which session this socket was part of and manage it.
    });
  });

  httpServer
    .once("error", (err) => {
      console.error("[SERVER] HTTP server error:", err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`[SERVER] > Ready on http://${hostname}:${port}`);
      console.log(`[SERVER] Socket.IO server initialized and listening on path /api/socket_io`);
    });
});
