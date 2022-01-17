const service = require('../services/userService');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await service.createUser({ name, email, password });

  if (user.statusCode) {
    return res
      .status(user.statusCode).json({ message: user.message });
  }

  res.status(201).json({ user });
};

module.exports = {
  createUser,
};
