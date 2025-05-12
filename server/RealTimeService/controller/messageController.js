const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const UserMessage = require("../models/UserMessage");

const getUserMessage = async (id, skip, limit = 20) => {
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
      _id: id, // manually setting _id to keep it consistent
      customerRead: false,
      adminRead: false, // or true — set your default as needed
      message_log: [], // empty message log initially
    });
  }

  let startIndex = 0;
  if (skip) {
    startIndex = userMessage.message_log.findIndex(
      (message) => message._id.toString() === skip.toString()
    );
    startIndex++; // Skip the message with the `skip` ID itself, start from the next one
  }

  // Get paginated messages based on the calculated start index
  const paginatedMessageLog = userMessage.message_log.slice(
    startIndex,
    startIndex + limit
  );

  return {
    _id: userMessage._id,
    message_log: paginatedMessageLog,
    customerRead: userMessage.customerRead,
    adminRead: userMessage.adminRead,
  };
};

const getAllUserMessage = async (searchText, page, limit = 20) => {
  const skip = (page - 1) * limit;

  const userMessages = await UserMessage.aggregate([
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$message_log", 0] },
      },
    },
    {
      $lookup: {
        from: "users", // Your users collection name
        localField: "_id", // Field in this collection that references a User _id
        foreignField: "_id", // _id in the User collection
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $match: {
        $or: [
          { "customer.username": { $regex: searchText, $options: "i" } }, // Case-insensitive search for username
          { "customer.email": { $regex: searchText, $options: "i" } }, // Case-insensitive search for email
        ],
      },
    },
    {
      $project: {
        message_log: 0,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  return userMessages;
};

const readMessage = async (id, customer, admin) => {
  const objectId = new mongoose.Types.ObjectId(id);

  let userMessage = await UserMessage.findById(objectId);

  if (!userMessage) {
    return false;
  }

  if (customer) userMessage.customerRead = true;
  if (admin) userMessage.adminRead = true;

  await userMessage.save();

  return true;
};

const getMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const skip = parseInt(req.query.skip) || "";
    const limit = parseInt(req.query.limit) || 20;

    const userMessage = await getUserMessage(id, skip, limit);

    res.status(200).json(userMessage);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const searchText = req.query.searchText || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const userMessages = await getAllUserMessage(searchText, page, limit);

    res.status(200).json(userMessages);
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
  getAllUserMessage,
  readMessage,
  getAllMessage,
  getMessage,
  addMessage,
};
