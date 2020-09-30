const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const linkValidation = /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,256})\.[A-Za-z]{2,20}/;
const { login, createUser } = require('../controllers/users');

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(500),
  }),
}), login);
authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(linkValidation).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(500),
  }),
}), createUser);

module.exports = authRouter;
