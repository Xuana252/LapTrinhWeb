const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const UserMessage = require("../models/UserMessage");

const getUserMessage = async (id, skip = 0, limit = 20) => {
  if (!id)
    return {
      _id: id,
      message_log: [],
      customerRead: false,
      adminRead: false,
    };

  let userMessage = await UserMessage.findById(id);

  if (!userMessage) {
    userMessage = await UserMessage.create({
      _id: objectId, // manually setting _id to keep it consistent
      read: false, // or true — set your default as needed
      message_log: [], // empty message log initially
    });
  }

  const paginatedMessageLog = userMessage.message_log.slice(skip, skip + limit);

  return {
    _id: userMessage._id,
    message_log: paginatedMessageLog,
    customerRead: userMessage.customerRead,
    adminRead: userMessage.adminRead,
  };
};

const readMessage = async (id, customer, admin) => {
  const objectId = new mongoose.Types.ObjectId(id);

  let userMessage = await UserMessage.findById(objectId);

  if (!userMessage) {
    return false;
  }

  userMessage.customerRead = customer;
  userMessage.adminRead = admin;

  await userMessage.save();

  return true;
};

const getMessage = asyncHandler(async (req, res) => {
  try {
    const { id, skip, limit } = req.params;
    const userMessage = await getUserMessage(id, skip, limit);

    res.status(200).json(userMessage);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sender, customerRead, adminRead } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);
    const userMessage = await UserMessage.findById(objectId);

    if (!userMessage) {
      res.status(404);
      throw new Error("UserMessage not found");
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      message,
      sender,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMessage.message_log.unshift(newMessage);
    userMessage.customerRead = customerRead;
    userMessage.adminRead = adminRead;
    await userMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getUserMessage,
  readMessage,
  getMessage,
  addMessage,
};
