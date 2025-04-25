const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();

router.use(
  '/',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/orders': '' },
  })
);

module.exports = router;
