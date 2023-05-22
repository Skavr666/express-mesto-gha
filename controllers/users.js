const userSchema = require('../models/user');

const {
  invalidDataErrorCode,
  dataNotFoundErrorCode,
  defaultErrorCode,
  defaultErrorMessage,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  userSchema
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(defaultErrorCode).send({ message: defaultErrorMessage }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  userSchema
    .findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(invalidDataErrorCode).send({ message: 'Error appears when get user' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(dataNotFoundErrorCode).send({ message: 'Could not find user by ID' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema
    .create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorCode).send({ message: 'Error appears when create user' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorCode).send({ message: 'Error appears when update user info' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(invalidDataErrorCode).send({ message: 'Error appears when update avatar' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};
