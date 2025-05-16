// socket.js
import { io } from "socket.io-client";

let socket = null;

export const SOCKET_JOIN_CHANNEL = {
  STAFF_JOIN: "STAFF_JOIN",
  STAFF_LEAVE: "STAFF_LEAVE",

  CUSTOMER_JOIN: "CUSTOMER_JOIN",
  CUSTOMER_LEAVE: "CUSTOMER_LEAVE",
};

export const SOCKET_INBOX_CHANNEL = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",

  GET_MORE_MESSAGES: "GET_MORE_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_MESSAGES: "GET_MESSAGES",

  SEEN_MESSAGE: "SEEN_MESSAGE",
  // DELETE_MESSAGE: "DELETE_MESSAGE",

  GET_MORE_CONVERSATIONS: "GET_MORE_CONVERSATIONS",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  // DELETE_CONVERSATION: "DELETE_CONVERSATION",
};

export const SOCKET_NOTIFICATION_CHANNEL = {
  GET_NOTIFICATIONS: "GET_NOTIFICATION",
  // GET_MORE_NOTIFICATIONS: "GET_MORE_NOTIFICATIONS",

  // SEEN_NOTIFICATION: "SEEN_NOTIFICATION",
  // ADD_NOTIFICATIONS: "ADD_NOTIFICATION",
  // DELETE_NOTIFICATION: "DELETE_NOTIFICATION",
  // CLEAR_NOTIFICATION: "CLEAR_NOTIFICATION",
};

export const getSocket = (customerId) => {
  if (!customerId) return null;
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_APP_URL}/realtime`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, {
        socket_id: socket.id,
        user_id: customerId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      socket.emit(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, {
        socket_id: socket.id,
        user_id: customerId,
      });
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });
  }

  return socket;
};
