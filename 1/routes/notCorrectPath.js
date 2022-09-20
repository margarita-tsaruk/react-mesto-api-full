const express = require('express');
const ErrorReqNotFound = require('../errors/errorReqNotFound');

const notCorrectPath = express.Router();

notCorrectPath.all('*', () => {
  throw new ErrorReqNotFound('Запрашиваемого ресурса не существует');
});

module.exports = notCorrectPath;
