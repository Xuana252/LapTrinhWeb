const express = require("express");
const {
  getUserCart,
  addProductToCart,
  updateCartItem,
  deleteCart,
  deleteCartItem
} = require("../controllers/cartController");
const router = express.Router();

router.get("/:userId", getUserCart);

router.post("/:userId", addProductToCart);

router.patch("/:userId/:productId", updateCartItem);

router.delete("/:userId/:productId", deleteCartItem);

router.delete("/:userId", deleteCart);

module.exports = router;
