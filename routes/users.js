const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUsersById,
  patchProfileInfo,
  patchProfileAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUsersById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), patchProfileInfo);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
}), patchProfileAvatar);

module.exports = usersRouter;
