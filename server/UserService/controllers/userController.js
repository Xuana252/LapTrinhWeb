const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const { json } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generaToken } = require("../utils/generateToken");

const getAllUser = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortUser = -1,
  } = req.query;

  const skip = (page - 1) * limit;

  const sortOptions = {
    [sortBy]: Number(sortUser),
  };

  const users = await User.find()
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("cart.product_id");

  const count = await User.countDocuments();

  res.status(200).json({ count: count, users });
});

const banUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "không tìm thấy user" });

  user.is_active = false;
  const updatedUser = await user.save();

  res.status(200).json(updatedUser);
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

  user.address.push(address);
  await user.save();

  res
    .status(200)
    .json({ address: user.address, message: "thêm địa chỉ thành công" });
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
  let updated=false

  const user = await User.findById(userId);
  if (!user) return res.status(404);

  user.address = user.address.map((a) => {
    if (a._id.toString() === address._id) {
      updated=true
      return{...a.toObject(),...address}
    }
     return a
  });

  if(!updated)
    return res.status(404)

  await user.save()

  return res.status(200).json({address:user.address})
});

const updatedUser = asyncHandler(async (req, res) => {
  const { username, phone_number, image } = req.body;
  const { userId } = res.params;

  const result = await User.findByIdAndUpdate(
    userId,
    { username, phone_number, image },
    { new: true }
  );

  if (!result) return res.status(404).json({ message: "Không tìm thấy user" });

  res.status(200).json({ user: result, message: "cập nhật thành công" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401);
  else if (bcrypt.compare(password, user.password))
    return res.status(200).json({ user, token: generaToken(user._id) });
  else return res.status(401);
});

const signup = asyncHandler(async (req, res) => {
  const { email, password, username, phone_number } = req.body;

  const checkUser = await User.findOne({ email });
  if (checkUser)
    return res.status(400).json({ message: "tài khoản đã tồn tại" });

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
  const {password} = req.body;

  const salt =await bcrypt.genSalt(10)
  const hashedPassword=await bcrypt.hash(password,salt)

  const user = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );
  if (!user) return res.status(404);

  return res.status(200).json({message:"đổi mật khẩu thành công"});
});

module.exports = {
  getAllUser,
  banUser,
  addAddress,
  deleteAddress,
  updatedAddress,
  updatedUser,
  login,
  signup,
  changePassword
};
