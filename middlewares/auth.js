// const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UserAuthError = require('../errors/UserAuthError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UserAuthError('Unauthorized'));
  }

  req.user = payload;

  return next();
};
