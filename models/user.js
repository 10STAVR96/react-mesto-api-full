const mongoose = require('mongoose');
const validator = require('validator'); // /^((http|https):\/\/)(www\.)?([a-zA-Z0-9/.#$!@%&-]{1,200})\.([a-zA-Z]{2,10})([a-zA-Z0-9/.#_%!@-]{1,256})?$/
const bcript = require('bcryptjs');

const validatorOptions = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_valid_protocol: true,
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link, validatorOptions);
      },
      message: 'Это не ссылка на картинку',
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введите корректный email!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcript.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
