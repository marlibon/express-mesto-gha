const Card = require('../models/card');
const mongoose = require('mongoose');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  handleErrors,
  throwNotFoundError,
} = require('../utils/handleErrors');

// получение всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' }
    ])
    .then(cards => res.send({ data: cards }))
    .catch((err) => handleErrors(err, res));
}

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user
  Card.create({ name, link, owner })
    .then(card => card.populate('owner'))
    .then(card => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => handleErrors(err, res));
}

// удаление карточки
module.exports.deleteCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndDelete({ _id })
    .populate([
      { path: 'owner', model: 'user' }
    ])
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

// постановка лайка
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' }
    ])
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}

// снятие лайка
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' }
    ])
    .then(card => {
      card
        ? res.send({ data: card })
        : throwNotFoundError()
    })
    .catch((err) => handleErrors(err, res));
}