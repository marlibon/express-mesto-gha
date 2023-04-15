const router = require('express').Router();
const { getUserDataById, getUsers, createUser, deleteUser, updateUserData, updateUserAvatar } = require('../controllers/users')

router.get('/:userId', getUserDataById);
router.get('/', getUsers);
router.post('/', createUser);
router.delete('/:userId', deleteUser);
router.patch('/me', updateUserData);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
