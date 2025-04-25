const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();

router.use(
  '/',
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/products': '' },
  })
);

module.exports = router;
