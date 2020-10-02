require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const authRouter = require('./routes/authRouter');
const auth = require('./middlewares/auth');

const app = express();
app.use(cors({ origin: true }));
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 20, // limit of requests per windowMs
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
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
app.use('/', authRouter);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err;
  if (name === 'ValidationError' || statusCode === 400) return res.status(400).send({ message: 'Переданы некорректные данные' }); // эта конструкция на случай, если валидация запросов через celebrate каким то образом не сработает
  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
