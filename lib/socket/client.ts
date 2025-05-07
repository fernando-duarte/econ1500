// lib/socket/client.ts

import { io, Socket } from "socket.io-client";

let socket: Socket;

/**
 * Returns a singleton Socket.IO client.
 * Emits no actions until you call join/submit-round.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io({ path: "/api/socket_io" });
  }
  return socket;
}
