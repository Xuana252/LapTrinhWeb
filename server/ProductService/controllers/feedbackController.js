const ProductFeedback = require("../models/ProductFeedback");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const asyncHandler = require("express-async-handler");

const getProductFeedback = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await ProductFeedback.find({ product_id: id })
      .populate("user_id")
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
      res.status(404).json({ message: `Could not find any product with ID ${id}` });
      return 
    }

    const order = await Order.findOne({
      user_id: customer_id,
      "order_item.product_id": id, 
      order_status: "delivered" 
    });

    if (!order) {
      res.status(400).json({ message: "You must have purchased this product to leave feedback." });
      return;
    }

    const existingFeedback = await ProductFeedback.findOne({
      product_id: id,
      user_id: customer_id,
    });

    if (existingFeedback) {
      existingFeedback.rating = rating;
      existingFeedback.feedback = feedback;
      await existingFeedback.save();
      res.status(200).json(existingFeedback);
    } else {
      const newFeedback = await ProductFeedback.create({
        product_id: id,
        user_id: customer_id,
        feedback: feedback,
        rating: rating,
      });
      res.status(201).json(newFeedback);
    }
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getProductFeedback,
  createProductFeedback,
};
