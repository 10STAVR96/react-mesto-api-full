const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail({ message: 'С запросом что-то не так', statusCode: 400 })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.postCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports.deleteCardById = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    .orFail({ message: 'Ошибка: карточки с таким id не существует', statusCode: 404 })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail({ message: 'Ошибка: карточки с таким id не существует', statusCode: 404 })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findOneAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail({ message: 'Ошибка: карточки с таким id не существует', statusCode: 404 })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
