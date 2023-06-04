const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authLimiterOptions = require('./configs/rateLimit');

const { createUser, login } = require('./controllers/users');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const router = require('./routes/router');
const errorHandler = require('./configs/errorHandler'); 

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

app.use(errorHandler); // Use the errorHandler middleware

async function start() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await app.listen(PORT);
    console.log(`Ееееее все запустилось\n${MONGO_URL}\nPort: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

start();
