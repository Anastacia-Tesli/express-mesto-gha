const User = require('../models/user');
const { INCORRECT_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../app');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'IncorrectError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'NotFoundError') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию.' });
    });
};
