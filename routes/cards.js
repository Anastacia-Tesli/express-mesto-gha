const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
