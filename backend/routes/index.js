const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  login,
  logout,
} = require('../controllers/users');
const regularExpression = require('../utils/utils');

const routes = express.Router();

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regularExpression),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

routes.delete('/signout', logout);

module.exports = routes;
