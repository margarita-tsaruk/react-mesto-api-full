const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();
const { validateUserId } = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', express.json(), getUsers);

userRoutes.get('/users/me', express.json(), getUser);

userRoutes.get('/users/:userId', validateUserId, getUserById);

userRoutes.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^https?:\/\/[w{3}]?[0-9a-z\-\.\_\~\:\/\?\#\[\]\!\&'\(\)\*\+\,\;=]+\#?$/),
  }),
}), updateAvatar);

module.exports = userRoutes;
