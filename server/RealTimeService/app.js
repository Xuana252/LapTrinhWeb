const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // Wrap app with HTTP server
const io = new Server(server);         // Attach Socket.IO to the HTTP server

const PORT = process.env.PORT || 8001;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(8004, () => {
  console.log('Server is running on http://localhost:4000');
});
