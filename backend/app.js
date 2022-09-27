require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorhandler');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    await app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

app.use(cors);

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
app.use('*', require('./routes/notCorrectPath'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
