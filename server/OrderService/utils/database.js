const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

async function connectToDB() {
    try {
      await mongoose.connect(MONGODB_URL);
      console.log("Connected to MongoDB!");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Optional: exit the app if connection fails
    }
  }
  
  module.exports = connectToDB;