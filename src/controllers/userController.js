const jwt = require('jsonwebtoken');
const service = require('../services/userService');

const JWT_SECRET = 'SecretWord1234';

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await service.createUser({ name, email, password });

  if (user.statusCode) {
    return res
      .status(user.statusCode).json({ message: user.message });
  }

  res.status(201).json({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await service.login({ email, password });

  if (result.statusCode) {
    return res
      .status(result.statusCode).json({ message: result.message });
  }

  const payload = {
    email,
    role: result.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
};

module.exports = {
  createUser,
  login,
};
