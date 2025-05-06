// app/api/socket.ts

import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import { growthModel } from "../../lib/constants";
import { runRound } from "../../lib/game/engine";
import type { Controls, State } from "../../lib/game/types";
import type { Server as HttpServer } from "http";

const sessions: Record<string, State[]> = {};

// Define a type for the server with socket.io
type SocketServer = {
  io?: Server;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // First cast to unknown, then to our specific type to avoid 'any'
  const socketRes = res as unknown;
  const server =
    socketRes && typeof socketRes === "object" && "socket" in socketRes
      ? (socketRes.socket as unknown as { server: SocketServer })?.server
      : undefined;

  if (server && !server.io) {
    // Use a more specific type that matches socket.io's expected server type
    const httpServer = server as unknown as HttpServer;
    const io = new Server(httpServer);
    server.io = io;

    io.on("connection", (socket) => {
      socket.on("join", (sessionId: string) => {
        if (!sessions[sessionId]) {
          sessions[sessionId] = [growthModel.initialState];
        }
        socket.join(sessionId);
        socket.emit("state", sessions[sessionId]);
      });

      socket.on(
        "submit-round",
        ({ sessionId, controls }: { sessionId: string; controls: Controls }) => {
          const history = sessions[sessionId];
          if (!history || history.length === 0) return;

          const prev = history[history.length - 1];
          const exogIndex = Math.min(history.length - 1, growthModel.exogenous.length - 1);
          const exog = growthModel.exogenous[exogIndex];

          if (!prev || !exog) return;

          const next = runRound(prev, controls, exog);
          history.push(next);
          io.to(sessionId).emit("state", history);
        }
      );
    });
  }
  res.end();
}
