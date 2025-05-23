// index.js
const express = require("express");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:3000";

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.use(errorMiddleware);
