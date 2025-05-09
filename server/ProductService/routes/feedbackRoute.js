const express = require("express");
const {
  getProductFeedback,
  createProductFeedback,
  getCustomerFeedback,
} = require("../controllers/feedbackController");
const router = express.Router();

router.get("/customer/:id", getCustomerFeedback);

router.get("/:id", getProductFeedback);

router.patch("/:id", createProductFeedback);

module.exports = router;
