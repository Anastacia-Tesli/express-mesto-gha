/* eslint-disable object-curly-newline */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  CREATED_CODE,
  AUTH_ERROR_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
} = require('../utils/constants');
const {
  IncorrectError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/index');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(AUTH_ERROR_MESSAGE);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(AUTH_ERROR_MESSAGE);
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWTKEY,
        {
          expiresIn: '7d',
        },
      );
      return res.send({
        token,
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .then(() => {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          });
        })
        .then(() => {
          res.status(CREATED_CODE).send({ name, about, avatar, email });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} при создании пользователя.`));
          }
          if (err.code === 11000) {
            next();
          }
          next(err);
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        user,
      });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({
        data: users,
      });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} пользователя.`));
      }
      return next(err);
    });
};

function updateUser(req, res, next, info) {
  User.findByIdAndUpdate(req.user._id, info, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
      }
      return res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} при обновлении информации.`));
      }
      return next(err);
    });
}
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  updateUser(req, res, next, {
    name,
    about,
  });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUser(req, res, next, {
    avatar,
  });
};
