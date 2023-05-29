const cardSchema = require('../models/card');

const InvalidDataError = require('../errors/InvalidDataError');
const NoRightsError = require('../errors/NoRightsError');
const DataNotFoundError = require('../errors/DataNotFoundError');

module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Error appears when create card'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Nothing to delete');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new NoRightsError('Forbidden'));
      }

      return card.deleteOne().then(() => res.status(200).send({ message: 'Deleted' }));
    })
    .catch(next);
};

module.exports.addCardLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Could not find card by ID');
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Error appears when add card like'));
        return;
      }

      next(err);
    });
};

module.exports.removeCardLike = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError('Could not find card by ID');
      }

      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Error appears when remove card like'));
        return;
      }

      next(err);
    });
};
