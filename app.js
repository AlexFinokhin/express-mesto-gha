const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authLimiterOptions = require('./configs/rateLimit');
const logger = require('./configs/winston');
const { createUser, login } = require('./controllers/users');
const notFoundError = require('./errors/404-NotFoundError');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const router = require('./routes/router');

const { MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb', PORT = 3000 } = process.env;

const app = express();

const authLimiter = rateLimit(authLimiterOptions);

app.use(bodyParser.json());
app.post('/signin', authLimiter, validationLogin, login);
app.post('/signup', authLimiter, validationCreateUser, createUser);
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(auth);
app.use(router);
app.use(errors());

app.use((error, request, response, next) => {
  const { status = 500, message } = error;
  response.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
  logger.error(`${status} - ${message}`);
  next();
});

async function start() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.use('*', (req, res) => {
      res.status(notFoundError).send({ message: 'Такой страницы нет' });
    });
    await app.listen(PORT);
    console.log(`Ееееее все запустилось\n${MONGO_URL}\nPort: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

start();
