require('dotenv').config();
const express = require('express');
const app = express();

const productRoutes = require('./routes/productRoute.js');
const userRoutes = require('./routes/userRoute.js');
const orderRoutes = require('./routes/orderRoute.js');

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
