const Card = require('../models/card');
const mongoose = require('mongoose');
const {
  handleErrors,
  throwNotFoundError,
} = require('../utils/handleErrors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => {
      const data = { data: cards }
      if (cards.length === 0) data = { ...data, message: 'Нет созданных карточек' }
      res.send(data)
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user
  if (!name || !link || !owner) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' })
    return
  }
  Card.create({ name, link, owner })
    .then(card => res.send({ data: card }))
    .catch((err) => handleErrors(err, res));
}

module.exports.deleteCard = (req, res) => {
  const _id = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' })
    return
  }
  Card.findByIdAndDelete({ _id })
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
    return
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

module.exports.dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
    return
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}