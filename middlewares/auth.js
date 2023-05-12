const jwt = require('jsonwebtoken');
const { JWT_CODE } = require('../utils/constants');

module.exports = (req, res, next) => {
  const tokenLocalStorage = req?.headers?.authorization?.split(' ')[1]
  const token = req.cookies.token || tokenLocalStorage;
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  return next();
};
