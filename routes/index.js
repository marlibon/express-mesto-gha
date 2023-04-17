const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  handleErrors,
  NotFoundError
} = require('../utils/handleErrors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', function (req, res) {
  const newError = new NotFoundError
  handleErrors(newError, res)
})
module.exports = router;