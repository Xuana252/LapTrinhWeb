const express = require("express");
const router = express.Router();
const {
  getOrder,
  getUserOrder,
  changeOrderStatus,
  addOrder,
  deleteOrder,
  getRevenue,
  getMonthlyRevenue,
  getYearlyRevenue,
  getMonthlyOrder,
} = require("../controllers/orderControllers");

// 1. Route cụ thể nên đặt trước
router.get("/revenue/total", getRevenue);
router.get("/revenue/month", getMonthlyRevenue);
router.get("/revenue/year", getYearlyRevenue);
router.get("/monthlyOrder", getMonthlyOrder);

// 2. Route không cụ thể
router.get("/", getOrder);
router.get("/:userId", getUserOrder);
router.post("/", addOrder);
router.patch("/:orderId", changeOrderStatus);
router.delete("/:orderId", deleteOrder);

module.exports = router;
