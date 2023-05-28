require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateUserCreation, validateLogin } = require('./middlewares/validators');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

app.post('/signin', validateLogin, login);
app.post('/signup', validateUserCreation, createUser);

app.use(auth);

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Server error' : message,
  });
  next();
});

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {});

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});
