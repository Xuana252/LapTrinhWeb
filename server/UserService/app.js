const express= require('express');
const connectToDB = require("./utils/database");
const dotenv=require('dotenv');
const errorMiddleware = require("./middleware/errorMiddleware");
const userRoute=require('./routes/userRoute')
// const addressRoute=require('./routes/addressRoute')
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT || 8002;
const API_GATEWAY = process.env.API_GATEWAY || "http://localhost:8000";

const app = express();
app.use(express.json());
app.use(cors({ origin: API_GATEWAY, optionSuccessStatus: 200 }));
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(errorMiddleware);
app.use('/',userRoute);
// app.use('/address',addressRoute)

connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});