// socket.js
import { SOCKET_JOIN_CHANNEL } from "@constant/SocketChannel";
import { io } from "socket.io-client";


let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_APP_URL}/realtime`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit(SOCKET_JOIN_CHANNEL.STAFF_JOIN, { socket_id: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      socket.emit(SOCKET_JOIN_CHANNEL.STAFF_JOIN, { socket_id: socket.id });
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });
  }

  return socket;
};
