const express = require("express");
const {
  getAllUser,
  getUser,
  updateUser,
  banUser,
  addAddress,
  deleteAddress,
  login,
  signup,
  getAddress,
  updatedAddress,
  changePassword,
} = require("../controllers/userController");
const router = express.Router();

router.get("/:userId/address/", getAddress);
router.post("/:userId/address/", addAddress);
router.patch("/:userId/address/", updatedAddress);
router.delete("/:userId/address/:addressId", deleteAddress);

router.post("/login", login);
router.post("/signup", signup);
router.patch("/changePassword/:userId", changePassword);

router.patch("/:userId/ban", banUser);
router.get("/:userId", getUser);
router.patch("/:userId", updateUser);
router.get("/", getAllUser);

module.exports = router;
