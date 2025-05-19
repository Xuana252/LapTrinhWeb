const express = require("express");
const http = require("http");
const cors = require("cors");
const connectToDB = require("./utils/database");
const messageRoute = require("./routes/messageRoute");
const notificationRoute = require("./routes/notificationRoute");

require("dotenv").config();
const { initializeSocket } = require("./socket/socket"); // new import

const PORT = process.env.PORT || 8004;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const app = express();
const server = http.createServer(app);

initializeSocket(server, API_GATEWAY); // Init socket separately

app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/message", messageRoute);
app.use("/notification", notificationRoute);

connectToDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
