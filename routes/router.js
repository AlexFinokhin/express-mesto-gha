const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const { validationCreateUser, validationLogin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/404-NotFoundError');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('Ошибка: Страница не найдена'));
});

module.exports = router;
