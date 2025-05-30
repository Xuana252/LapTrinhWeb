const ProductFeedback = require("../models/ProductFeedback");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getProductFeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await ProductFeedback.find({ product_id: id })
      .populate("user_id", "image email createdAt username is_active _id")
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const createProductFeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, rating, feedback } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      res
        .status(404)
        .json({ message: `Could not find any product with ID ${id}` });
      return;
    }

    const userid = new mongoose.Types.ObjectId(customer_id);
    if (!userid) {
      res.status(400).json({ message: "Invalid user ID" });
    }

    const order = await Order.findOne({
      user_id: userid,
      "order_item.product_id": id,
      order_status: "delivered",
    });

    if (!order) {
      res.status(400).json({
        message: "You must have purchased this product to leave feedback.",
      });
      return;
    }

    const existingFeedback = await ProductFeedback.findOne({
      product_id: id,
      user_id: userid,
    }).populate("user_id", "image email createdAt username is_active _id");

    if (existingFeedback) {
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback;
      await existingFeedback.save();
      res.status(200).json(existingFeedback);
    } else {
      const user = await User.findById(user_id).select(
        "image email createdAt username is_active _id"
      );
      const newFeedback = await ProductFeedback.create({
        product_id: id,
        user_id: userid,
        feedback: feedback,
        rating: rating,
      });
      res.status(201).json({...newFeedback, user_id: user });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getCustomerFeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const feedbacks = await ProductFeedback.find({ user_id: id }).populate({
      path: "user_id",
      select: "image email createdAt username is_active _id",
    });

    const populatedFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {
        const productId = new mongoose.Types.ObjectId(fb.product_id);

        const product = await Product.aggregate([
          { $match: { _id: productId } },
          {
            $lookup: {
              from: "productfeedbacks",
              localField: "_id",
              foreignField: "product_id",
              as: "feedbacks",
            },
          },
          {
            $addFields: {
              feedback_count: { $size: "$feedbacks" },
              average_rating: {
                $cond: {
                  if: { $gt: [{ $size: "$feedbacks" }, 0] },
                  then: { $avg: "$feedbacks.rating" },
                  else: 0,
                },
              },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              feedbacks: 0,
            },
          },
        ]);
        return {
          ...fb.toObject(),
          product_id: product[0] || null, // Rename key for clarity
        };
      })
    );

    res.status(200).json(populatedFeedbacks);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getProductFeedback,
  createProductFeedback,
  getCustomerFeedback,
};
