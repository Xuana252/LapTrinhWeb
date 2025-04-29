const Product = require("../models/ProductModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "productfeedbacks", // The collection name for feedback
          localField: "_id", // Local field (Product _id)
          foreignField: "product_id", // Foreign field (ProductFeedback product_id)
          as: "feedbacks", // Join and return feedbacks
        },
      },
      {
        $addFields: {
          feedback_count: { $size: "$feedbacks" },
          average_rating: {
            $cond: {
              if: { $gt: [{ $size: "$feedbacks" }, 0] }, // Check if there are any feedbacks
              then: {
                $avg: "$feedbacks.rating", // Calculate the average rating
              },
              else: 0, // If no feedbacks, set average_rating to 0
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories", // Assuming your categories are in the "categories" collection
          localField: "category_id", // Local field (Product category_id)
          foreignField: "_id", // Foreign field (Category _id)
          as: "category", // Join and return category data
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true }, // Unwind category array
      },
      {
        $project: {
          feedbacks: 0, // exclude feedbacks array
        },
      },
      {
        $sort: { createdAt: 1 }, // Sorting by createdAt to show products in ascending order
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new mongoose.Types.ObjectId(id);

    const product = await Product.aggregate([
      {
        $match: { _id: objectId }, // Match the product by its ID
      },
      {
        $lookup: {
          from: "productfeedbacks", // The collection name for feedback
          localField: "_id", // Local field (Product _id)
          foreignField: "product_id", // Foreign field (ProductFeedback product_id)
          as: "feedbacks", // Join and return feedbacks
        },
      },
      {
        $addFields: {
          feedback_count: { $size: "$feedbacks" },
          average_rating: {
            $cond: {
              if: { $gt: [{ $size: "$feedbacks" }, 0] }, // Check if there are any feedbacks
              then: {
                $avg: "$feedbacks.rating", // Calculate the average rating
              },
              else: 0, // If no feedbacks, set average_rating to 0
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories", // Assuming your categories are in the "categories" collection
          localField: "category_id", // Local field (Product category_id)
          foreignField: "_id", // Foreign field (Category _id)
          as: "category", // Join and return category data
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true }, // Unwind category array
      },
      {
        $project: {
          feedbacks: 0, // exclude feedbacks array
        },
      },
    ]);

    if (!product) {
      res
        .status(404)
        .json({ message: `Could not find any product with ID ${id}` });
      return;
    }

    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    //if found no product with the id
    if (!product) {
      res
        .status(404)
        .json({ message: `Could not find any product with ID ${id}` });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      res
        .status(404)
        .json({ message: `Could not find any product with ID ${id}` });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
