const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sender: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const userMessageSchema = new mongoose.Schema(
  {
    read: { type: Boolean, required: true },
    message_log: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserMessage", userMessageSchema);
