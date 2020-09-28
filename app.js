const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(500),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(500),
  }),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  if (name === 'ValidationError' || statusCode === 400) return res.status(400).send({ message: 'Переданы некорректные данные' }); // эта конструкция на случай, если валидация запросов через celebrate каким то образом не сработает
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
