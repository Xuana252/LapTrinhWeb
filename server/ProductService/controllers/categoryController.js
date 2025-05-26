const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const categories = await Category.findById(id);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getCategoryRevenue = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const categoryMonthlyRevenue = await Order.aggregate([
      { $unwind: "$order_item" },
      {
        $lookup: {
          from: "products", // the name of the Product collection in MongoDB
          localField: "order_item.product_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" }, // because lookup returns an array
      {
        $match: {
          "productInfo.category_id": new mongoose.Types.ObjectId(id),
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
              $multiply: ["$order_item.price", "$order_item.quantity"],
            },
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const now = new Date();
    const start = new Date(2024, 7); // August is month 7 (0-indexed)

    const monthlyMap = new Map();
    categoryMonthlyRevenue.forEach((entry) => {
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

const getCategoriesRevenue = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const rawData = await Order.aggregate([
      { $unwind: "$order_item" },
      {
        $lookup: {
          from: "products",
          localField: "order_item.product_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            category_id: "$productInfo.category_id",
          },
          revenue: {
            $sum: {
              $multiply: ["$order_item.price", "$order_item.quantity"],
            },
          },
          count: {
            $sum: "$order_item.quantity",
          },
        },
      },
    ]);

    // Build a map: key = `${year}-${month}-${category_id}` for quick lookup
    const dataMap = new Map();
    rawData.forEach((entry) => {
      const key = `${entry._id.year}-${entry._id.month}-${entry._id.category_id}`;
      dataMap.set(key, entry);
    });

    // Get months between August 2024 and now
    const start = new Date(2024, 7); // August (0-indexed)
    const now = new Date();
    const result = [];

    while (start <= now) {
      const year = start.getFullYear();
      const month = start.getMonth() + 1;
      const monthKey = { year, month };
      const monthEntry = {
        _id: monthKey,
        categories: [],
      };

      for (const cat of categories) {
        const key = `${year}-${month}-${cat._id}`;
        if (dataMap.has(key)) {
          const { revenue, count } = dataMap.get(key);
          monthEntry.categories.push({
            category: cat,
            revenue,
            count,
          });
        } else {
          monthEntry.categories.push({
            category: cat,
            revenue: 0,
            count: 0,
          });
        }
      }

      result.push(monthEntry);
      start.setMonth(start.getMonth() + 1);
    }

    const categoryTotals = new Map();

    for (const month of result) {
      for (const entry of month.categories) {
        const id = entry.category._id.toString();
        if (!categoryTotals.has(id)) {
          categoryTotals.set(id, {
            category: entry.category,
            revenue: 0,
            count: 0,
          });
        }

        const agg = categoryTotals.get(id);
        agg.revenue += entry.revenue;
        agg.count += entry.count;
      }
    }

    // 2. Convert to array and sort by revenue
    const alltime = Array.from(categoryTotals.values());

    res.status(200).json({
      alltime,
      monthly: result,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category_name, discount } = req.body;

    const newCategory = new Category({ category_name, discount });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, discount } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category_name, discount },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      res.status(404);
      throw new Error("Category not found");
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const update = await Product.updateMany(
      { category_id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          category_id: new mongoose.Types.ObjectId("681871ede975d436de633115"),//fallback category
        },
      }
    );

    if (!update.acknowledged) {
      throw new Error("Failed to update product category");
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      res.status(404);
      throw new Error("Category not found");
    }



    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = {
  getCategories,
  getCategory,
  getCategoryRevenue,
  getCategoriesRevenue,
  createCategory,
  updateCategory,
  deleteCategory,
};
