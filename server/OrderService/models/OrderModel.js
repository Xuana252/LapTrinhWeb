const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_item: {
      type: [orderItemSchema],
      required: true,
      validate: [arr => arr.length > 0, "Order must have at least one item"],
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    order_status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["cod", "momo", "zalopay"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
