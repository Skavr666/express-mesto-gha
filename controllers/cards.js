const cardSchema = require('../models/card');

const defaultErrorMessage = 'Server error';
const defaultErrorCode = 500;

module.exports.getCards = (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(defaultErrorCode).send({ message: defaultErrorMessage }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Error appears when create card' });
      } else {
        res.status(defaultErrorCode).send({ message: defaultErrorMessage });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Error appears when get card' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Could not find card by ID' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};

module.exports.addCardLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Could not find card by ID' });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Error appears when add card like' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};

module.exports.removeCardLike = (req, res) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Could not find card by ID' });
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Error appears when remove card like' });
        return;
      }

      res.status(defaultErrorCode).send({ message: defaultErrorMessage });
    });
};
