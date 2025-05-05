const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryRevenue,
  getCategoriesRevenue,
} = require("../controllers/categoryController"); 

const router = express.Router();


router.get("/:id/revenue", getCategoryRevenue);

router.get("/revenue", getCategoriesRevenue);

router.get("/:id", getCategory);

router.get("/", getCategories);


router.post("/", createCategory);


router.patch("/:id", updateCategory);


router.delete("/:id", deleteCategory);

module.exports = router;
