const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataError = require('../errors/incorrect-data-err');
const LoginError = require('../errors/login-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail({ message: 'С запросом что-то не так', statusCode: 400 })
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUsersById = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .orFail({ message: 'Нет пользователя с таким id', statusCode: 404 })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcript.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(new IncorrectDataError(err)));
};
module.exports.patchProfileInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .orFail({ message: 'Нет пользователя с таким id', statusCode: 404 })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
module.exports.patchProfileAvatar = (req, res, next) => {
  const { link } = req.body;
  User.findOneAndUpdate({ _id: req.user._id }, { avatar: link }, { new: true, runValidators: true })
    .orFail({ message: 'Нет пользователя с таким id', statusCode: 404 })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '8bbd4030f8582f167501f0f684544cca6c49b7145c49551e1a2a2636d3e486c0',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(new LoginError(err.message)));
};
