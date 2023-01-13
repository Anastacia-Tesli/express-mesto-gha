const mongoose = require('mongoose');
const User = require('../models/user');
const {
  CREATED_CODE,
  INCORRECT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND_USER_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} при создании пользователя.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_MESSAGE });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} пользователя.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

function updateUser(req, res, info) {
  User.findByIdAndUpdate(req.user._id, info, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_USER_MESSAGE });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} при обновлении информации.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
}
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};
