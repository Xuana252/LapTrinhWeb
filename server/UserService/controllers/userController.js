const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");

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

const addUser = asyncHandler(async (req, res) => {
  const user = User.create(req.body);
  res.status(200).json(user, { message: "thêm user thành công" });
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
  const  address  = req.body;

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

  if(result.modifiedCount===0)
    return res.status(404).json({error:'không tìm thấy địa chỉ để xóa'})

  res.status(200).json({address:result,message:"xóa thành công"})
});

module.exports = {
  getAllUser,
  addUser,
  banUser,
  addAddress,
  deleteAddress
};
