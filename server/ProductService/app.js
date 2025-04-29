// index.js
const express = require("express");
const connectToDB = require("./utils/database");
const productRoute = require('./routes/productRoute')
const feedbackRoute = require('./routes/feedbackRoute')
const categoryRoute = require('./routes/categoryRoute')
const cartRoute = require('./routes/cartRoute')
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 8001;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/category',categoryRoute)
app.use('/feedback',feedbackRoute)
app.use('/cart',cartRoute)
app.use('/',productRoute)

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});

app.use(errorMiddleware);
