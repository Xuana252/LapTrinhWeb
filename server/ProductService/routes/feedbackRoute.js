const express = require("express");
const {
  getProductFeedback,
  createProductFeedback,
} = require("../controllers/feedbackController");
const router = express.Router();

router.get("/:id", getProductFeedback);

router.patch("/:id", createProductFeedback);

module.exports = router;
