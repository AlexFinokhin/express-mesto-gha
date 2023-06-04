const router = require('express')
  .Router();
const rateLimit = require('express-rate-limit');

const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const authLimiterOptions = require('../configs/rateLimit');

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFoundError = require('../errors/404-NotFoundError');

const authLimiter = rateLimit(authLimiterOptions);

router.post('/signin', authLimiter, validationLogin, login);
router.post('/signup', authLimiter, validationCreateUser, createUser);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('Ошибка: Страница не найдена'));
});

module.exports = router;
