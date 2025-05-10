const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectToDB = require("./utils/database");
const messageRoute = require('./routes/messageRoute')
const notificationRoute = require('./routes/notificationRoute')

require("dotenv").config();

const SOCKET_JOIN_CHANNEL = {
  STAFF_JOIN: "STAFF_JOIN",
  STAFF_LEAVE: "STAFF_LEAVE",

  CUSTOMER_JOIN: "CUSTOMER_JOIN",
  CUSTOMER_LEAVE: "CUSTOMER_LEAVE",
};

const SOCKET_INBOX_CHANNEL = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",

  GET_MORE_MESSAGES: "GET_MORE_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_MESSAGES: "GET_MESSAGES",
  DELETE_MESSAGE: "DELETE_MESSAGE",

  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
};

const PORT = process.env.PORT || 8001;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const app = express();
const server = http.createServer(app); // Wrap app with HTTP server
const io = new Server(server, {
  cors: {
    origin: API_GATEWAY,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));

app.use('/message',messageRoute)
app.use('/notification',notificationRoute)

// Socket.IO connection
io.of("/realtime").on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on(SOCKET_INBOX_CHANNEL.ADD_MESSAGE, (msg) => {
    console.log("Message received:", msg);
    io.emit("chat message", msg); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on(SOCKET_JOIN_CHANNEL.CUSTOMER_JOIN, (data) => {
    console.log("Customer joined:", data);
  });

  socket.on(SOCKET_INBOX_CHANNEL.JOIN_ROOM, ({ room_id }) => {
    socket.join(room_id);
    console.log(`Socket ${socket.id} joined room ${room_id}`);
  });
});

// Start server
connectToDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
