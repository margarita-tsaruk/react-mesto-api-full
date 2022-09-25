require('dotenv').config();

console.log(process.env.NODE_ENV);
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const {
  createUser,
  login,
  logout,
} = require('./controllers/users');

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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().regex(/(https?:\/\/)(www)?([a-z\d.-]+)\.([a-z.])([a-z\d-._~:/?#[\]@!$&'()*+,;=]*)(#)?$/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.delete('/signout', logout);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
app.use('*', require('./routes/notCorrectPath'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
