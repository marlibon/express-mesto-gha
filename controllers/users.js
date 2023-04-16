const User = require('../models/user');
const mongoose = require('mongoose');
const {
  handleErrors,
  throwNotFoundError,
  throwError
} = require('../utils/handleErrors');


module.exports.getUserDataById = (req, res) => {
  const _id = req.params.userId

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send({ message: 'Не верный формат указания ID пользователя (проверьте длину)' });
    return
  }

  User.findById({ _id })
    .then(user => {
      user.length !== 0
        ? res.send({ data: user })
        : throwError()
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
    .then(user => res.send({ data: user }))
    .catch((err) => handleErrors(err, res));
}

module.exports.deleteUser = (req, res) => {
  const _id = req.params.userId;
  User.findByIdAndDelete({ _id })
    .then(user => {
      user
        ? res.send({ data: user })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.updateUserData = (req, res) => {
  const { name, about } = req.body
  let data = {}
  name && (data = { ...data, name })
  about && (data = { ...data, about })
  if (Object.keys(data).length === 0 || !mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' })
    return
  }

  User.findByIdAndUpdate(
    req.user._id,
    { ...data },
    { new: true, runValidators: true },
  )
    .then(user => {
      user
        ? res.send({ data: user })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  if (!avatar) {
    res.status(400).send({ message: 'Не правильно переданы данные' })
    return
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then(user => {
      user
        ? res.send({ data: user })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));

}