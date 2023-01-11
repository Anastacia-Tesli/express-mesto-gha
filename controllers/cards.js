const Card = require('../models/card');
const {
  INCORRECT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные карточки.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
