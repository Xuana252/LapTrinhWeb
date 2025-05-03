const express = require("express");
const {getProducts,getProductById,createProduct,updateProduct,deleteProduct, getProductRevenue, getProductsRevenue} = require('../controllers/productController')
const router = express.Router()


router.get('/revenue',getProductsRevenue)

router.get('/',getProducts)

router.get('/:id/revenue',getProductRevenue)

router.get('/:id',getProductById)



router.post('/',createProduct)

router.patch('/:id', updateProduct)
  
router.delete('/:id', deleteProduct)

module.exports = router