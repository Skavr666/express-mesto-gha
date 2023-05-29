const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const DataNotFoundError = require('../errors/DataNotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (req, res, next) => {
  next(new DataNotFoundError('Not found'));
});

module.exports = router;
