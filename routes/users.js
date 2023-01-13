const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
