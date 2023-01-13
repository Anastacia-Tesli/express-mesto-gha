const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  CREATED_CODE,
  INCORRECT_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  NOT_FOUND_CARD_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
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
    .populate('owner')
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} при создании карточки.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_CARD_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} карточки.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('likes')
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_CARD_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} для снятия лайка.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('likes')
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: NOT_FOUND_CARD_MESSAGE });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(INCORRECT_ERROR_CODE)
          .send({ message: `${INCORRECT_ERROR_MESSAGE} для снятия лайка.` });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};
