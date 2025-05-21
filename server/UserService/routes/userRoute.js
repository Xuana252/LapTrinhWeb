const express=require("express")
const { getAllUser, banUser, addAddress, deleteAddress, login, signup, updatedAddress, changePassword } = require("../controllers/userController")
const router=express.Router()

router.post("/:userId/address/",addAddress)
router.delete("/:userId/address/:addressId",deleteAddress)
router.patch("/:userId/address/",updatedAddress)

router.get("/login",login)
router.post("/signup",signup)
router.post("/changePassword/:userId",changePassword)

router.get("/",getAllUser)
router.patch("/:userId",banUser)

module.exports=router