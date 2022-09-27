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

cardRoutes.get('/cards', getCards);

cardRoutes.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      // eslint-disable-next-line no-useless-escape
      .regex(/(https?:\/\/)(www)?([a-z\d.-]+)\.([a-z.])([a-z\d-._~:/?#[\]@!$&'()*+,;=]*)(#)?$/i),
  }),
}), createCards);

cardRoutes.delete('/cards/:cardId', validateCardId, deleteCard);

cardRoutes.put('/cards/:cardId/likes', validateCardId, likeCard);

cardRoutes.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRoutes;
