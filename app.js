const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const logger = require('./configs/winston');
const auth = require('./middlewares/auth');
const router = require('./routes/router');

const { MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb', PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(auth);
app.use(router);

app.use((error, request, response, next) => {
  const { status = 500, message } = error;
  const errorMessage = status === 500 ? 'На сервере произошла ошибка' : message;

  response.status(status).json({ message: errorMessage });
  logger.error(`${status} - ${errorMessage}`);
  next();
});

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
