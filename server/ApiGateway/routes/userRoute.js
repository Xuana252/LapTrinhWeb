const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const router = express.Router();

router.use(
  '/',
  createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/users': '' },
  })
);

module.exports = router;
