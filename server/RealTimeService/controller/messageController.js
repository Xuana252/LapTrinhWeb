const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const UserMessage = require("../models/UserMessage");

const getMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);

    let userMessage = await UserMessage.findById(objectId);

    if (!userMessage) {
      userMessage = await UserMessage.create({
        _id: objectId, // manually setting _id to keep it consistent
        read: false, // or true — set your default as needed
        message_log: [], // empty message log initially
      });
    }

    res.status(200).json(userMessage);

  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sender } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);
    const userMessage = await UserMessage.findById(objectId);

    if (!userMessage) {
      res.status(404);
      throw new Error("UserMessage not found");
    }

    // Append new message to message_log
    userMessage.message_log.push({ message, sender });
    await userMessage.save();

    res.status(200).json(userMessage);

  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getMessage,
  addMessage,
};
