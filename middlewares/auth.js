/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');
const { UnauthorizedError } = require('../errors/index');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWTKEY);
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
  }

  req.user = payload;

  next();
};
