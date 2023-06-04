const router = require('express').Router();
const { validationCreateUser, validationLogin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFoundError = require('../errors/404-NotFoundError');

const auth = require('../middlewares/auth'); // Добавлен импорт middleware auth

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth); // Добавлен middleware auth перед роутами users и cards

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('Ошибка: Страница не найдена'));
});

module.exports = router;
