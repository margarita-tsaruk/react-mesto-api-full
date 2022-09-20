const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardRoutes = express.Router();
const { validateCardId } = require('../middlewares/validation');

const {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', express.json(), getCards);

cardRoutes.post('/cards', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      // eslint-disable-next-line no-useless-escape
      .regex(/^https?:\/\/[w{3}]?[0-9a-z\-\.\_\~\:\/\?\#\[\]\!\&'\(\)\*\+\,\;=]+\#?$/),
  }),
}), createCards);

cardRoutes.delete('/cards/:cardId', express.json(), validateCardId, deleteCard);

cardRoutes.put('/cards/:cardId/likes', express.json(), validateCardId, likeCard);

cardRoutes.delete('/cards/:cardId/likes', express.json(), validateCardId, dislikeCard);

module.exports = cardRoutes;
