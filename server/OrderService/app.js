const express= require('express');
const connectToDB = require("./utils/database");
const dotenv=require('dotenv');
const errorMiddleware = require("./middleware/errorMiddleware");
const orderRoute=require('./routes/orderRoute')
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 8001;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const app = express();
app.use(express.json());
app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));
app.use(errorMiddleware);
app.use('/',orderRoute);

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});

