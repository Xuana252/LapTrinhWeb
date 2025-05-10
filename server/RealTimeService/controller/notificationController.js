const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

const getNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);

    let user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const notifications = user.notification.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message, sender } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Create new notification
    const newNotification = {
      message,
      sender,
    };

    // Add to the beginning of the array
    user.notification.unshift(newNotification);
    await user.save();

    // Return the first notification (the one just added)
    const added = user.notification[0];

    res.status(200).json(added);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteAllNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.notification = [];
    await user.save();

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { id, notificationId } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.notification = user.notification.filter(
      (n) => n._id.toString() !== notificationId
    );

    await user.save();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getNotification,
  addNotification,
  deleteNotification,
  deleteAllNotification
};
