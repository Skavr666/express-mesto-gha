const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '646b4b71fe44274a23541f61',
  };

  next();
});
app.use(router);

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});
