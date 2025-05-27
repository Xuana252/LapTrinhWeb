const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");
const ProductFeedback = require("../models/ProductFeedback");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.aggregate([
      // Filter for delivered orders
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
        $sort: { createdAt: -1 }, // Sorting by createdAt to show products in ascending order
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getProductRevenue = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);

    const productRevenueData = await Order.aggregate([
      { $unwind: "$order_item" },
      {
        $match: {
          "order_item.product_id": objectId,
          order_status: "delivered",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: {
            $sum: "$order_item.quantity",
          },
          revenue: {
            $sum: {
              $multiply: ["$order_item.quantity", "$order_item.price"],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const now = new Date();
    const start = new Date(2024, 7); // August is month 7 (0-indexed)

    const monthlyMap = new Map();
    productRevenueData.forEach((entry) => {
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
          count: 0,
          revenue: 0,
        });
      }

      // move to next month
      start.setMonth(start.getMonth() + 1);
    }

    const total = monthly.reduce((acc, cur) => acc + cur.revenue, 0);
    const sold = monthly.reduce((acc, cur) => acc + cur.count, 0);

    res.status(200).json({
      total,
      sold,
      monthly,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getProductsRevenue = asyncHandler(async (req, res) => {
  const start = new Date(2024, 7, 1);

  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          order_status: "delivered",
          createdAt: { $gte: start },
        },
      },
      { $unwind: "$order_item" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            product_id: "$order_item.product_id",
          },
          revenue: {
            $sum: { $multiply: ["$order_item.quantity", "$order_item.price"] },
          },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          products: {
            $push: {
              product_id: "$_id.product_id",
              revenue: "$revenue",
            },
          },
          total: { $sum: "$revenue" },
        },
      },
      {
        $addFields: {
          top3: {
            $slice: [
              {
                $sortArray: {
                  input: "$products",
                  sortBy: { revenue: -1 },
                },
              },
              3,
            ],
          },
        },
      },
      {
        $project: {
          _id: {
            month: "$_id.month", // Include month in the final result
            year: "$_id.year", // Include year in the final result
          },
          total: 1, // Include total revenue for the month
          top3: {
            $map: {
              input: "$top3", // Map through the top 3 products
              as: "item",
              in: {
                product_id: "$$item.product_id",
                revenue: "$$item.revenue",
              },
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
    ]);

    const now = new Date();

    const monthlyMap = new Map();

    // Map the data by year-month (key)
    monthlyRevenue.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}`;
      monthlyMap.set(key, entry);
    });

    const monthly = [];
    while (start <= now) {
      const year = start.getFullYear();
      const month = start.getMonth() + 1; // Convert to 1-based month

      const key = `${year}-${month}`;

      // Check if the data exists for the current month, otherwise create a default object
      if (monthlyMap.has(key)) {
        monthly.push(monthlyMap.get(key));
      } else {
        monthly.push({
          _id: { year, month },
          total: 0,
          top3: [],
        });
      }

      // Move to the next month
      start.setMonth(start.getMonth() + 1);
    }

    // Step 1: Get the last 2 months with data
    const latest = monthly.slice(-1);

    // Step 2: Collect all unique product IDs from those 2 months
    const allTopProductIds = [
      ...new Set(
        latest.flatMap((m) => m.top3.map((id) => id.product_id.toString()))
      ),
    ].map((id) => new mongoose.Types.ObjectId(id));

    // Step 3: Fetch product details with rating and category
    const enrichedProducts = await Product.aggregate([
      { $match: { _id: { $in: allTopProductIds } } },
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
            $cond: [
              { $gt: [{ $size: "$feedbacks" }, 0] },
              { $avg: "$feedbacks.rating" },
              0,
            ],
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
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { feedbacks: 0 } },
    ]);

    // Step 4: Replace top3 IDs with enriched product objects in latest two months
    latest.forEach((monthEntry) => {
      monthEntry.top3 = monthEntry.top3.map((entry) => ({
        revenue: entry.revenue,
        ...enrichedProducts.find(
          (p) => String(p._id) === String(entry.product_id)
        ),
      }));
    });

    // 4. All-Time Top 3 and Total Revenue
    const allTimeData = await Order.aggregate([
      { $match: { order_status: "delivered" } },
      { $unwind: "$order_item" },
      {
        $group: {
          _id: "$order_item.product_id",
          revenue: {
            $sum: { $multiply: ["$order_item.quantity", "$order_item.price"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $group: {
          _id: null,
          top3: {
            $push: {
              product_id: "$_id",
              revenue: "$revenue",
            },
          },
          totalRevenue: { $sum: "$revenue" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          top3: { $slice: ["$top3", 3] },
        },
      },
    ]);

    let allTime = null;
    if (allTimeData.length) {
      const ids = allTimeData[0].top3.map((p) => p.product_id);
      const top3Enriched = await Product.aggregate([
        { $match: { _id: { $in: ids } } },
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
              $cond: [
                { $gt: [{ $size: "$feedbacks" }, 0] },
                { $avg: "$feedbacks.rating" },
                0,
              ],
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
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $project: { feedbacks: 0 } },
      ]);

      allTime = {
        total: allTimeData[0].totalRevenue,
        top3: allTimeData[0].top3.map((entry) => ({
          revenue: entry.revenue,
          ...top3Enriched.find(
            (p) => String(p._id) === String(entry.product_id)
          ),
        })),
      };
    }

    // Final Response
    res.status(200).json({
      monthly,
      total: allTime.total,
      top3: allTime.top3,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
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

    await Order.updateMany(
      {},
      {
        $pull: {
          order_item: { product_id: new mongoose.Types.ObjectId(id) },
        },
      }
    );

    await User.updateMany(
      {},
      {
        $pull: {
          cart: { product_id: new mongoose.Types.ObjectId(id) },
        },
      }
    );

    await ProductFeedback.deleteMany({
      product_id: new mongoose.Types.ObjectId(id),
    });

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
  getProductRevenue,
  getProductsRevenue,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
