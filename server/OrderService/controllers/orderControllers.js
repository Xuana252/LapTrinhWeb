const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user_id", "-password")
    .populate("order_item.product_id");
  res.status(200).json(orders);
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await Order.find({ user_id: userId })
    .populate("user_id", "-password")
    .populate("order_item.product_id");
  res.status(200).json(orders);
});

const changeOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "không tìm thấy order" });

  order.order_status = status;
  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

const addOrder = asyncHandler(async (req, res) => {
  const order = Order.create(req.body);
  res.status(200).json(order);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "không tìm thấy order" });
  await order.deleteOne();

  res.status(200).json({ message: "xóa order thành công" });
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const { month } = req.query;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month);

  const orders = await Order.find({
    createdAt: { $gte: start, $lt: end },
    order_status: "delivered",
  }).select("total_price");

  const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  res.status(200).json({ revenue });
});

const getYearlyRevenue = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const start = new Date(year);
  const end = new Date(year + 1);

  const orders = await Order.find({
    createdAt: { $gte: start, $lt: end },
    order_status: "delivered",
  }).select("total_price");

  const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  res.status(200).json({ revenue });
});

const getRevenue = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    order_status: "delivered",
  }).select("total_price");

  const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
  res.status(200).json({ revenue });
});

module.exports = {
  getOrder,
  getUserOrder,
  changeOrderStatus,
  addOrder,
  deleteOrder,
  getMonthlyRevenue,
  getYearlyRevenue,
  getRevenue,
};
