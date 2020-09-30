const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const linkValidation = /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,256})\.[A-Za-z]{2,20}/;
const {
  getCards,
  postCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(linkValidation).required(),
  }),
}), postCards);
cardsRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteCardById);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), likeCard);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
}), dislikeCard);

module.exports = cardsRouter;
