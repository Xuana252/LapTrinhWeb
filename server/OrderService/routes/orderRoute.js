const express=require('express');
const router=express.Router();
const {getOrder,getUserOrder,changeOrderStatus,addOrder,deleteOrder, getRevenue, getMonthlyRevenue, getYearlyRevenue}=require('../controllers/orderControllers')

router.get('/',getOrder);

router.get('/:userId',getUserOrder)

router.post('/',addOrder)

router.patch('/:orderId',changeOrderStatus)

router.delete('/:orderId',deleteOrder)

router.get('/revenue/total',getRevenue)

router.get('/revenue/month',getMonthlyRevenue)

router.get('/revenue/year',getYearlyRevenue)

module.exports=router