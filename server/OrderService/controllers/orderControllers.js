const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const getAllOrder = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    searchText = "",
    dateSort = 0,
    revenueSort = 0,
    orderStatus,
  } = req.query;

  // Tạo bộ lọc (filter) động
  const filter = {};

  let userIds = [];
  if (searchText.trim()) {
    const users = await User.find({
      $or: [
        { username: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
      ],
    }).select("_id");

    userIds = users.map((user) => user._id);
    filter.user_id = { $in: userIds };
  }

  if (orderStatus) {
    filter.order_status = orderStatus;
  }

  // Tính offset phân trang
  const skip = (page - 1) * limit;

  const sortOptions = {};
  if (Number(dateSort) !== 0) {
    sortOptions.createdAt = Number(dateSort); // 1 for asc, -1 for desc
  }
  if (Number(revenueSort) === 0 && Number(dateSort) === 0) {
    sortOptions.createdAt = 1;
  }
  if (Number(revenueSort) !== 0) {
    sortOptions.total_price = Number(revenueSort);
  }

  // Fetch dữ liệu với filter, sort và phân trang
  const orders = await Order.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate("user_id", "-password -notification -cart")
    .populate("order_item.product_id");

  // Đếm tổng số order (phục vụ tính tổng trang)
  const count = await Order.countDocuments(filter);

  res.status(200).json({
    count,
    orders: orders.reverse(),
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const objectId = new mongoose.Types.ObjectId(id);
  let order = await Order.findById(objectId)
    .populate("user_id", "-password -notification -cart")
    .populate({
      path: "order_item.product_id",
      populate: {
        path: "category_id", // Assuming product.category_id is a ref
        model: "Category", // Replace with your actual category model name
      },
    });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  // Manually map `category` field into each order_item
  const orderObject = order.toObject();
  orderObject.order_item = orderObject.order_item.map((item) => {
    return {
      ...item,
      product_id: {
        ...item.product_id,
        category: item.product_id.category_id || null,
      },
    };
  });

  res.status(200).json(orderObject);
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const orders = await Order.find({ user_id: userId })
    .populate("user_id", "-password -notification -cart")
    .populate({
      path: "order_item.product_id",
      populate: {
        path: "category_id",
        model: "Category",
      },
    });

  // Convert to plain objects and map category into each product
  const formattedOrders = orders.map((order) => {
    const orderObj = order.toObject();
    orderObj.order_item = orderObj.order_item.map((item) => ({
      ...item,
      product_id: {
        ...item.product_id,
        category: item.product_id.category_id || null,
      },
    }));
    return orderObj;
  });

  res.status(200).json(formattedOrders);
});

const changeOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "không tìm thấy order" });

  order.order_status = status;
  const updatedOrder = await order.save();

  fetch(`${API_GATEWAY}/realtime/notification/${order.user_id.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Your order: ${order._id.toString()}, is ${status.toString()}`,
    }),
  }).catch((err) => {
    console.error("Failed to send notification:", err);
    // optionally log, but do nothing else
  });

  res.status(200).json(updatedOrder);
});

const addOrder = asyncHandler(async (req, res) => {
  const { user_id, order_item } = req.body;

  const objectId = new mongoose.Types.ObjectId(user_id);

  const user = await User.findById(objectId);

  const error = [];

  for (const item of order_item) {
    const productId = new mongoose.Types.ObjectId(item.product_id);
    const product = await Product.findById(productId);

    if (!product) {
      error.push(`Product not found.`);
      continue;
    }

    if (item.quantity > product.stock_quantity) {
      error.push(
        `Insufficient stock (${product.product_name} , in-stock: ${product.stock_quantity}, require: ${item.quantity})`
      );
    }
  }

  if (error.length > 0) {
    return res.status(400).json({
      message: error.join("\n"),
    });
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const order = await Order.create(req.body);

  if (order) {
    for (const item of order_item) {
      const productId = new mongoose.Types.ObjectId(item.product_id);
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock_quantity: -item.quantity },
      });
    }

    const orderedProductIds = order_item.map((item) =>
      item.product_id.toString()
    );

    user.cart = user.cart.filter(
      (c) => !orderedProductIds.includes(c.product_id.toString())
    );
    await user.save();
  }

  res.status(200).json(order);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "không tìm thấy order" });
  await order.deleteOne();

  res.status(200).json({ message: "xóa order thành công" });
});

const getUserRevenue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const objectId = new mongoose.Types.ObjectId(id);
  // Monthly revenue
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        user_id: objectId,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$total_price" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const topCategories = await Order.aggregate([
    { $match: { user_id: objectId } },
    { $unwind: "$order_item" },
    {
      $lookup: {
        from: "products",
        localField: "order_item.product_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.category_id",
        totalQuantity: { $sum: "$order_item.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 3 },
    {
      $project: {
        _id: 0,
        category_id: "$_id",
        totalQuantity: 1,
      },
    },
  ]);

  const categories = await Category.find({
    _id: { $in: topCategories.map((c) => c.category_id) },
  });

  const now = new Date();
  const start = new Date(2024, 7); // August is month 7 (0-indexed)

  const monthlyMap = new Map();
  monthlyRevenue.forEach((entry) => {
    const key = `${entry._id.year}-${entry._id.month}`;
    monthlyMap.set(key, entry);
  });

  const monthly = [];
  while (start <= now) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1; // convert to 1-based month
    const key = `${year}-${month}`;

    if (monthlyMap.has(key)) {
      monthly.push(monthlyMap.get(key));
    } else {
      monthly.push({
        _id: { year, month },
        revenue: 0,
      });
    }

    // move to next month
    start.setMonth(start.getMonth() + 1);
  }

  const total = monthly.reduce((acc, cur) => acc + cur.revenue, 0);

  res.status(200).json({ total, categories, monthly });
});


const getRevenue = asyncHandler(async (req, res) => {
  // Monthly revenue
  const monthlyRevenue = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$total_price" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const now = new Date();
  const start = new Date(2024, 7); // August is month 7 (0-indexed)

  const monthlyMap = new Map();
  monthlyRevenue.forEach((entry) => {
    const key = `${entry._id.year}-${entry._id.month}`;
    monthlyMap.set(key, entry);
  });

  const monthly = [];
  while (start <= now) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1; // convert to 1-based month
    const key = `${year}-${month}`;

    if (monthlyMap.has(key)) {
      monthly.push(monthlyMap.get(key));
    } else {
      monthly.push({
        _id: { year, month },
        revenue: 0,
      });
    }

    // move to next month
    start.setMonth(start.getMonth() + 1);
  }

  const total = monthly.reduce((acc, cur) => acc + cur.revenue, 0);

  res.status(200).json({ total, monthly });
});

const getMonthlyOrder = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  // Count total orders today
  const today = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  // Count today's pending orders
  const todayPending = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
    order_status: "pending",
  });

  // Count total by status
  const [order, pending, delivered, cancelled] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ order_status: "pending" }),
    Order.countDocuments({ order_status: "delivered" }),
    Order.countDocuments({ order_status: "cancelled" }),
  ]);

  // Monthly aggregation
  const monthlyRaw = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        order: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$order_status", "pending"] }, 1, 0],
          },
        },
        cancelled: {
          $sum: {
            $cond: [{ $eq: ["$order_status", "cancelled"] }, 1, 0],
          },
        },
        delivered: {
          $sum: {
            $cond: [{ $eq: ["$order_status", "delivered"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyMap = {};
  for (const m of monthlyRaw) {
    const key = `${m._id.year}-${m._id.month}`;
    monthlyMap[key] = {
      _id: m._id,
      count: {
        order: m.order,
        pending: m.pending,
        cancelled: m.cancelled,
        delivered: m.delivered,
      },
    };
  }

  const start = new Date(2024, 7); // August is month 7 (0-indexed)
  const end = new Date(now.getFullYear(), now.getMonth());
  // Format monthly data to match the template

  const formattedMonthly = [];
  let current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1; // Convert to 1-based
    const key = `${year}-${month}`;

    formattedMonthly.push(
      monthlyMap[key] || {
        _id: { year, month },
        count: {
          order: 0,
          pending: 0,
          cancelled: 0,
          delivered: 0,
        },
      }
    );

    // Go to next month
    current.setMonth(current.getMonth() + 1);
  }

  // Final response
  res.status(200).json({
    today,
    todayPending,
    order,
    pending,
    delivered,
    cancelled,
    monthly: formattedMonthly,
  });
});

module.exports = {
  getOrder,
  getAllOrder,
  getUserOrders,
  changeOrderStatus,
  addOrder,
  deleteOrder,
<<<<<<< HEAD
  getUserRevenue,
=======
  getMonthlyRevenue,
>>>>>>> vinh
  getRevenue,
  getMonthlyOrder,
};
