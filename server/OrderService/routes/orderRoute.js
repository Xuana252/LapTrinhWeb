const express=require('express');
const router=express.Router();
const {getOrder,getUserOrder,changeOrderStatus,addOrder,deleteOrder}=require('../controllers/orderControllers')

router.get('/',getOrder);

router.get('/:userId',getUserOrder)

router.post('/',addOrder)

router.patch('/:orderId',changeOrderStatus)

router.delete('/:orderId',deleteOrder)

module.exports=router