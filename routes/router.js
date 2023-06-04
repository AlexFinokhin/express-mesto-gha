const router = require('express')
  .Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFoundError = require('../errors/404-NotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('Ошибка: Страница не найдена'));
});

module.exports = router;
