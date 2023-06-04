const router = require('express').Router();
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

const authLimiterOptions = require('../configs/rateLimit');
const NotFoundError = require('../errors/404-NotFoundError');

const authLimiter = rateLimit(authLimiterOptions);

router.post('/signin', authLimiter, validationLogin, login);
router.post('/signup', authLimiter, validationCreateUser, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('Ошибка: Страница не найдена'));
});
router.use(errors());

module.exports = router;
