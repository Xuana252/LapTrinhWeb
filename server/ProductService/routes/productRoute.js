const express = require("express");
const {getProducts,getProductById,createProduct,updateProduct,deleteProduct} = require('../controllers/productController')
const router = express.Router()

router.get('/',getProducts)

router.get('/:id',getProductById)

router.post('/',createProduct)

router.patch('/:id', updateProduct)
  
router.delete('/:id', deleteProduct)

module.exports = router