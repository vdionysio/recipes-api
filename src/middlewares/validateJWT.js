const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const JWT_SECRET = 'SecretWord1234';

  if (!token) {
    const err = new Error('jwt malformed');
    err.statusCode = 401;

    return next(err);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    return next();
  } catch (err) {
    err.message = 'jwt malformed';
    err.statusCode = 401;
    return next(err);
  }
};