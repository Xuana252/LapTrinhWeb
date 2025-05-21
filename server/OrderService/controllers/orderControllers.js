const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");

const getOrder = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    orderStatus,
    sortBy = "createdAt",
    sortOrder = -1,
  } = req.query;

  // Tạo bộ lọc (filter) động
  const filter = {};
  if (orderStatus) {
    filter.order_status = orderStatus;
  }

  // Tính offset phân trang
  const skip = (page - 1) * limit;

  // Tạo object sắp xếp
  const sortOptions = {
    [sortBy]: Number(sortOrder),
  };

  // Fetch dữ liệu với filter, sort và phân trang
  const orders = await Order.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user_id", "-password")
    .populate("order_item.product_id");

  // Đếm tổng số order (phục vụ tính tổng trang)
  const count = await Order.countDocuments(filter);

  res.status(200).json({
    count: count,
    orders,
  });
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
  res.status(200).json(order,{ message: "thêm order thành công" });
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

  const revenueResult = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end },
        order_status: "delivered",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total_price" },
      },
    },
  ]);

  const revenue = revenueResult[0]?.totalRevenue || 0;
  res.status(200).json({ revenue });
});


const getRevenue = asyncHandler(async (req, res) => {
  const revenueResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total_price" },
      },
    },
  ]);

  const revenue = revenueResult[0]?.totalRevenue || 0;
  res.status(200).json({ revenue });
});

const getMonthlyOrder = asyncHandler(async (req, res) => {
  const now = new Date();
  const startofDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endofDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const todayOrderCount = await Order.countDocuments({
    createdAt: {
      $gte: startofDay,
      $lt: endofDay,
    },
  });
  const status = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const result = [];
  for (let i = 0; i < status.length; i++) {
    result[i] = await Order.countDocuments({
      order_status: status[i],
    });
  }
  const totalOrder = await Order.countDocuments();
  res
    .status(200)
    .json({
      totalOrder,
      todayOrderCount,
      pendingOrder: result[0],
      processingOrder: result[1],
      shippedgOrder: result[2],
      deliveredOrder: result[3],
      cancelledOrder: result[4],
    });
});

module.exports = {
  getOrder,
  getUserOrder,
  changeOrderStatus,
  addOrder,
  deleteOrder,
  getMonthlyRevenue,
  getRevenue,
  getMonthlyOrder
};
