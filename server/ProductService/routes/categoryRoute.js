const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController"); // <- right controller now

const router = express.Router();


router.get("/", getCategories);


router.post("/", createCategory);


router.patch("/:id", updateCategory);


router.delete("/:id", deleteCategory);

module.exports = router;
