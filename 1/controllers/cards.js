const Card = require('../models/card');

const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorForbiddenReq = require('../errors/errorForbiddenReq');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorReqNotFound('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ErrorForbiddenReq('Нет прав на удаление карточки');
      } else {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => {
            res.send(removedCard);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ErrorReqNotFound('Передан несуществующий _id карточки.');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ErrorReqNotFound('Передан несуществующий _id карточки.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
