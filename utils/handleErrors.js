const mongoose = require('mongoose');
const http2 = require('http2');
const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED, // на будущее)
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;
const URL_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const { CastError, ValidationError } = mongoose.Error
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

function handleErrors (error, response) {
  if (error instanceof NotFoundError) {
    return response.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Данные не найдены' });
  }
  if (error instanceof CastError || error instanceof ValidationError) {
    return response.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return response.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка сервера ${HTTP_STATUS_INTERNAL_SERVER_ERROR}` });
}

function throwNotFoundError () {
  throw new NotFoundError();
}
function throwError () {
  throw new Error();
}

module.exports = {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  handleErrors,
  throwNotFoundError,
  throwError,
  URL_REGEXP,
  NotFoundError
};