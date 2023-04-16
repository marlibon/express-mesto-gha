const ERROR_INTERNAL_SERVER = 500;
const ERROR_NOT_FOUND = 404;
const ERROR_BAD_REQUEST = 400;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

function handleErrors (error, response) {
  const { name } = error
  switch (name) {
    case 'CastError':
    case 'ValidationError':
    case 'OtherError':
      return response.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    case 'NotFoundError':
      return response.status(ERROR_NOT_FOUND).send({ message: 'Данные не найдены' });
    default:
      return response.status(ERROR_INTERNAL_SERVER).send({ message: `Произошла ошибка сервера ${ERROR_INTERNAL_SERVER}` });
  }
}
function throwNotFoundError () {
  throw new NotFoundError();
}
function throwError () {
  throw new Error();
}

module.exports = {
  ERROR_INTERNAL_SERVER,
  ERROR_NOT_FOUND,
  ERROR_BAD_REQUEST,
  handleErrors,
  throwNotFoundError,
  throwError
};