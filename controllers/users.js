const User = require('../models/user');
const mongoose = require('mongoose');

module.exports.getUserDataById = (req, res) => {
  const _id = req.params.userId

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send({ message: 'Не верный формат указания ID пользователя (проверьте длину)' });
    return
  }

  User.find({ _id })
    .then(user => {
      user.length !== 0
        ? res.send({ data: user })
        : res.status(404).send({ message: 'Пользователь по указанному _id не найден' })
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', error: err.message }));
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => {
      const data = { data: users }
      if (users.length === 0) data = { ...data, message: 'Нет зарегистрированных пользователей' }
      res.send(data)
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' })
    return
  }
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.deleteUser = (req, res) => {
  const _id = req.params.userId;
  User.findByIdAndDelete({ _id })
    .then(user => {
      user
        ? res.send({ data: user })
        : res.status(400).send({ message: 'Пользователь не найден. Удаление не удалось' })
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
    { new: true },
  )
    .then(user => {
      user
        ? res.send({ data: user })
        : res.status(404).send({ message: 'Пользователь с указанным _id не найден.' })
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
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
        : res.status(404).send({ message: 'Пользователь с указанным _id не найден.' })
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}