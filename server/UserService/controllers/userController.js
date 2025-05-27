const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { json } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generaToken } = require("../utils/generateToken");
const { default: mongoose } = require("mongoose");

const getAllUser = asyncHandler(async (req, res) => {
  const {
    page = "1",
    limit = "10",
    searchText = "",
    dateSort = "-1",
    banFilter = "0",
  } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const dateSortNum = parseInt(dateSort);
  const banFilterNum = parseInt(banFilter);

  const skip = (pageNum - 1) * limitNum;

  const query = {
    $or: [
      { username: { $regex: searchText, $options: "i" } },
      { email: { $regex: searchText, $options: "i" } },
    ],
  };

  if (banFilterNum !== 0) {
    query.is_active = banFilterNum === 1;
  }

  const users = await User.find(query)
    .sort({ createdAt: dateSortNum })
    .skip(skip)
    .limit(limitNum)
    .select("-__v -password -notification -cart -address");

  const count = await User.countDocuments(query);

  res.status(200).json({ count: count, users });
});

const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const objectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(objectId).select(
    "-__v -password -notification -cart -address"
  );

  if (!user) return res.status(404).json({ message: "không tìm thấy user" });

  res.status(200).json(user);
});

const banUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select(
    "-__v -password -notification -cart -address"
  );

  if (!user) return res.status(404).json({ message: "không tìm thấy user" });

  user.is_active = !user.is_active;
  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
});

const getAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "không tìm thấy user" });

  res.status(200).json(user.address);
});

const addAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const address = req.body;

  const requiredFields = [
    "province",
    "district",
    "ward",
    "name",
    "phone_number",
    "detailed_address",
  ];
  for (const field of requiredFields) {
    if (!address[field])
      return res.status(400).json({ error: `Missing field: ${field}` });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "không tìm thấy user" });

  user.address.unshift(address);
  await user.save();

  const addedAddress = user.address[0] ?? null;
  res.status(200).json(addedAddress);
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { userId, addressId } = req.params;

  const result = await User.updateOne(
    { _id: userId },
    { $pull: { address: { _id: addressId } } }
  );

  if (result.modifiedCount === 0)
    return res.status(404).json({ error: "không tìm thấy địa chỉ để xóa" });

  res.status(200).json({ address: result, message: "xóa thành công" });
});

const updatedAddress = asyncHandler(async (req, res) => {
  const address = req.body;
  const { userId } = req.params;
  let updated = false;

  const user = await User.findById(userId);
  if (!user) return res.status(404);

  user.address = user.address.map((a) => {
    if (a._id.toString() === address._id) {
      updated = true;
      return { ...a.toObject(), ...address };
    }
    return a;
  });

  if (!updated) return res.status(404);

  await user.save();

  const updatedAddress = user.address.find(
    (a) => a._id.toString() === address._id
  );

  return res.status(200).json(updatedAddress);
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, phone_number, image } = req.body;
  const { userId } = req.params;

  const result = await User.findByIdAndUpdate(
    userId,
    { username, phone_number, image },
    { new: true }
  ).select("-__v -password -notification -cart -address");

  if (!result) return res.status(404).json({ message: "Không tìm thấy user" });

  res.status(200).json(result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select(
    "-__v  -notification -cart -address"
  );

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  if (!user.is_active) {
    return res.status(403).json({ message: "Account is banned" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  return res.status(200).json({
    user,
    expires_in: 3600 * 24 * 30,
    token: generaToken(user._id),
  });
});

const signup = asyncHandler(async (req, res) => {
  const { email, password, username, phone_number } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser) return res.status(400).json({ message: "Email đã tồn tại" });

  const user = await User.create({
    email,
    password,
    username,
    phone_number,
  });

  const { password: _, ...userData } = user.toObject();

  res.status(200).json(userData);
});

const changePassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { password, newPassword } = req.body;

  const objectId = new mongoose.Types.ObjectId(userId);

  const user = await User.findById(objectId);
  if (!user) return res.status(404);

  const isMatch = await user.comparePassword(password);

  if (isMatch) {
    user.password = newPassword;
    user.save();
    return res.status(200).json({ message: "đổi mật khẩu thành công" });
  } else {
    return res.status(401).json({ message: "Wrong password" });
  }
});

const getMonthlyUser = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const total = await User.countDocuments();

  const today = await User.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay },
  });

  const banned = await User.countDocuments({
    is_active: false,
  });

  const monthlyRaw = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyMap = {};
  for (const m of monthlyRaw) {
    const key = `${m._id.year}-${m._id.month}`;
    monthlyMap[key] = {
      _id: m._id,
      count: m.count,
    };
  }

  const start = new Date(2024, 7);
  const end = new Date(now.getFullYear(), now.getMonth());

  const formattedMonthly = [];
  let current = new Date(start);

  while (current <= end) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1; // Convert to 1-based
    const key = `${year}-${month}`;

    formattedMonthly.push(
      monthlyMap[key] || {
        _id: { year, month },
        count: 0,
      }
    );

    // Go to next month
    current.setMonth(current.getMonth() + 1);
  }

  return res
    .status(200)
    .json({ total, today, banned, monthly: formattedMonthly });
});

module.exports = {
  getAllUser,
  getUser,
  updateUser,
  getAddress,
  banUser,
  addAddress,
  deleteAddress,
  updatedAddress,
  login,
  signup,
  changePassword,
  getMonthlyUser,
};
