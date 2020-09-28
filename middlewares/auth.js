const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const err = new Error('Необходима авторизация');
  err.statusCode = 401;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(err);
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '8bbd4030f8582f167501f0f684544cca6c49b7145c49551e1a2a2636d3e486c0');
  } catch (e) {
    next(err);
  }
  req.user = payload;
  next();
};
