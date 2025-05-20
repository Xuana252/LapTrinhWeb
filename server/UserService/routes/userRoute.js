const express=require("express")
const { getAllUser, addUser, banUser, addAddress, deleteAddress } = require("../controllers/userController")
const router=express.Router()

router.post("/:userId/address/",addAddress)
router.delete("/:userId/address/:addressId",deleteAddress)

router.get("/",getAllUser)
router.post("/",addUser)
router.patch("/:userId",banUser)

module.exports=router