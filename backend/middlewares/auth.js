const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload;
  return next();
};

module.exports = auth;
