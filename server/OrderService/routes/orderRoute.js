const express = require("express");
const router = express.Router();
const {
  getOrder,
  getAllOrder,
  getUserOrders,
  changeOrderStatus,
  addOrder,
  deleteOrder,
  getRevenue,
  getUserRevenue,
  getMonthlyOrder,
} = require("../controllers/orderControllers");

// 1. Route cụ thể nên đặt trước
router.get("/:id/revenue", getUserRevenue);
router.get("/revenue", getRevenue);
router.get("/monthlyOrder", getMonthlyOrder);

// 2. Route không cụ thể
router.get("/customer/:userId", getUserOrders);
router.get("/:id", getOrder);
router.get("/", getAllOrder);
router.post("/", addOrder);
router.patch("/:orderId", changeOrderStatus);
router.delete("/:orderId", deleteOrder);

module.exports = router;
