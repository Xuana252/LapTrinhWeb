const Category = require("../models/CategoryModel");
const asyncHandler = require("express-async-handler");

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

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { category_name, discount } = req.body;

    const newCategory = new Category({ category_name, discount });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
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

    res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

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
  createCategory,
  updateCategory,
  deleteCategory,
};
