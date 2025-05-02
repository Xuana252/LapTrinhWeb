const express=require('express');
const router=express.Router();
const {getOrder}=require('../controllers/orderControllers')

router.get('/',getOrder);

module.exports=router