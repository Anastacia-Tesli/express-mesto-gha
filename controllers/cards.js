const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  CREATED_CODE,
  NOT_FOUND_CARD_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
} = require('../utils/constants');
const { IncorrectError, ForbiddenError, NotFoundError } = require('../errors/index');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} при создании карточки.`));
      }
      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(NOT_FOUND_CARD_MESSAGE);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Доступ запрещен');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} карточки.`));
      }
      return next(err);
    });
};

function modifyLike(req, res, next, action) {
  Card.findByIdAndUpdate(req.params.cardId, action, { new: true })
    .populate('likes')
    .then((card) => {
      if (card === null) {
        throw new NotFoundError(NOT_FOUND_CARD_MESSAGE);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} для лайка.`));
      }
      return next(err);
    });
}
module.exports.putLike = (req, res, next) => {
  modifyLike(req, res, next, { $addToSet: { likes: req.user._id } });
};

module.exports.deleteLike = (req, res, next) => {
  modifyLike(req, res, next, { $pull: { likes: req.user._id } });
};
