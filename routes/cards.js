const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

const { validateCardCreation, validateCardId } = require('../middlewares/validators');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardCreation, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateCardId, addCardLike);
cardRouter.delete('/:cardId/likes', validateCardId, removeCardLike);

module.exports = cardRouter;
