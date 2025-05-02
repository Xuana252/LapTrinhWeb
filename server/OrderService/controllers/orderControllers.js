const Order = require("../models/OrderModel");
const asyncHandler = require("express-async-handler");

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user_id", "-password")
    .populate("order_item.product_id");
  res.status(200).json(orders);
  console.log("getOrder")
});

module.exports = {
  getOrder,
};
