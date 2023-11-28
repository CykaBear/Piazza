const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParder = require('body-parser')
require('dotenv/config')

const postRoute = require('./routes/posts');
app.use('/api/post',postRoute);

mongoose.connect(process.env.DB_CONNECTOR);

app.listen(3000, () => {
  console.log(`Server is running`);
});
