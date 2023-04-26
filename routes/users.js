const router = require('express').Router();
const { getUsers, getCurrentUserData, updateUserData, updateUserAvatar } = require('../controllers/users')
const { validateUserData, validateUserAvatar } = require('../utils/validate/userValidate')

router.get('/me', getCurrentUserData);
router.get('/', getUsers);
router.patch('/me', validateUserData, updateUserData);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
