const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const { getIO, connectedCustomers } = require("../socket/socket");
const { SOCKET_NOTIFICATION_CHANNEL } = require("../constant/channel");

const getNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const skip = req.query.skip || "";
    const limit = parseInt(req.query.limit) || 20;
    const objectId = new mongoose.Types.ObjectId(id);

    let user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    let notifications = user.notification;

    notifications = notifications.sort((a, b) => b.createdAt - a.createdAt);

    if (skip) {
      const skipNotif = notifications.find((n) => n._id.toString() === skip);

      if (skipNotif) {
        const skipDate = skipNotif.createdAt;
        notifications = notifications.filter((n) => n.createdAt < skipDate);
      }
    }

    const limited = notifications.slice(0, parseInt(limit) || 10);

    const unreadCount = user.notification.reduce(
      (count, n) => (!n.read ? count + 1 : count),
      0
    );
    res.status(200).json({
      notifications: limited,
      unreadCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const readNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { notification_id } = req.body;
    const objectId = new mongoose.Types.ObjectId(id);

    let user = await User.findById(objectId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const notification = user.notification.id(notification_id);

    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }

    notification.read = true; // Update read status

    await user.save(); // Save user document

    res.status(200).json(notification);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const addNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const objectId = new mongoose.Types.ObjectId(id);
    const user = await User.findById(objectId);

    if (!user) {
      throw new Error("User not found");
    }

    // Create new notification
    const newNotification = {
      message,
      read: false,
    };

    // Add to the beginning of the array
    user.notification.unshift(newNotification);
    await user.save();

    const added = user.notification[0];

    const customer = connectedCustomers.find((c) => c.user_id === id);

    if (customer) {
      const io = getIO();
      io.of("/realtime")
        .to(customer.socket_id)
        .emit(SOCKET_NOTIFICATION_CHANNEL.GET_NOTIFICATIONS, added);
    }

    // Return the first notification (the one just added)

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
  readNotification,
  deleteNotification,
  deleteAllNotification,
};
