const cardRouter = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', addCardLike);
cardRouter.delete('/:cardId/likes', removeCardLike);

module.exports = cardRouter;
