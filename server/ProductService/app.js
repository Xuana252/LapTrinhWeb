// index.js
const express = require('express');
const app = express();
const cors =require('cors')

require('dotenv').config()

const PORT = process.env.PORT||3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
