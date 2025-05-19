require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const http = require("http")

const app = express();
const server = require("http").createServer(app);

const SHOP_URL = process.env.SHOP_URL || "http://localhost:3000";
const STORE_URL = process.env.STORE_URL || "http://localhost:3001";

// CORS configuration
app.use(
  cors({
    origin: [SHOP_URL, STORE_URL], // Allow all domains, adjust this in production
    optionsSuccessStatus: 200, // Legacy browsers
  })
);

// Proxy setup for each route

// Proxy for /products route
app.use(
  "/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE, // URL for the Product service (e.g., 'http://localhost:5000')
    changeOrigin: true,
    pathRewrite: { "^/products": "" }, // Optional: remove '/products' prefix
  })
);

// Proxy for /users route
app.use(
  "/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE, // URL for the User service (e.g., 'http://localhost:5001')
    changeOrigin: true,
    pathRewrite: { "^/users": "" }, // Optional: remove '/users' prefix
  })
);

// Proxy for /orders route
app.use(
  "/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE, // URL for the Order service (e.g., 'http://localhost:5002')
    changeOrigin: true,
    pathRewrite: { "^/orders": "" }, // Optional: remove '/orders' prefix
  })
);

// Proxy for /realtime route
const proxy = createProxyMiddleware({
  target: process.env.REALTIME_SERVICE,
  ws: true,
  changeOrigin: true,
  pathRewrite: { "^/realtime": "" },
});

app.use("/realtime", proxy);


// Start the server
const PORT = process.env.PORT || 8000;
server.on("upgrade", proxy.upgrade)

server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
