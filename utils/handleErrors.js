const mongoose = require('mongoose');
const http2 = require('http2');
const {
  HTTP_STATUS_CREATED, // 201
  HTTP_STATUS_BAD_REQUEST, // 400
  HTTP_STATUS_UNAUTHORIZED, // 401
  HTTP_STATUS_FORBIDDEN, // 403
  HTTP_STATUS_NOT_FOUND, //404
  HTTP_STATUS_CONFLICT, //409
  HTTP_STATUS_INTERNAL_SERVER_ERROR, //500
} = http2.constants;
const { CastError, ValidationError } = mongoose.Error

class NotFoundError extends Error {
  constructor(message = 'Данные не найдены') {
    super(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND;
  }
}
class UnauthorizedError extends Error {
  constructor(message = 'Авторизация не удалась') {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}
class ForbiddenError extends Error {
  constructor(message = 'Ошибка доступа') {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

function handleErrors (error, response) {
  if (error.code === 11000) {
    return response.status(HTTP_STATUS_CONFLICT).send({ message: 'Пользователь с данным email уже существует' });
  }
  if (error instanceof NotFoundError || error instanceof UnauthorizedError || error instanceof ForbiddenError) {
    const { message } = error;
    return response.status(error.statusCode).send({ message });
  }
  if (error instanceof CastError || error instanceof ValidationError) {
    return response.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
  }
  return response.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка сервера ${HTTP_STATUS_INTERNAL_SERVER_ERROR}` });
}

function throwNotFoundError (message) {
  throw new NotFoundError(message);
}

function throwUnauthorizedError (message) {
  throw new UnauthorizedError(message);
}

function throwForbiddenError (message) {
  throw new ForbiddenError(message);
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
  throwUnauthorizedError,
  throwForbiddenError,
  throwError,
  NotFoundError,
  UnauthorizedError,
};
