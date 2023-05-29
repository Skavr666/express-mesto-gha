const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const InvalidDataError = require('../errors/InvalidDataError');
const DataNotFoundError = require('../errors/DataNotFoundError');
const ConflictError = require('../errors/ConflictError');
const UserAuthError = require('../errors/UserAuthError');

const { saltRounds } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError('Could not find user by ID');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidDataError('Error appears when get user'));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, saltRounds)
    .then((hash) => userSchema.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      data: {
        name, about, avatar, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('User is already exist'));
      }
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Error appears when create user'));
      }

      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Error appears when update user info'));
        return;
      }

      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Error appears when update avatar'));
        return;
      }

      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userSchema
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UserAuthError('Invalid email or password'));
      }
      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            return next(new UserAuthError('Invalid email or password'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError('Could not find user by ID');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidDataError('Error appears when get user'));
      }
      return next(err);
    });
};
