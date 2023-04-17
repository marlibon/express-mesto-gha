const User = require('../models/user');
const mongoose = require('mongoose');
const {
  handleErrors,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  throwNotFoundError,
} = require('../utils/handleErrors');


module.exports.getUserDataById = (req, res) => {
  const _id = req.params.userId
  User.findById({ _id })
    .then(user => {
      user
        ? res.send({ data: user })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => handleErrors(err, res));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(HTTP_STATUS_CREATED).send({ data: user }))
    .catch((err) => handleErrors(err, res));
}

// функция для обновления данных пользователя
const updateUser = (req, res, updateData) => {
  User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true },
  )
    .then(user => {
      user
        ? res.send({ data: user })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

// декоратор для обновления имени и описания пользователя
module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body
  updateUser(req, res, { name, about });
}

// декоратор для обновления аватара пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  updateUser(req, res, { avatar });
}