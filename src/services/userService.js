const model = require('../models/userModel');
const userSchema = require('../schemas/userSchema');

const createUser = async ({ name, email, password }) => {
  const { error } = userSchema.validate({ name, email, password });

  if (error) return { message: 'Invalid entries. Try again.', statusCode: 400 };

  const user = await model.getByEmail(email);

  if (user) {
    return { message: 'Email already registered', statusCode: 409 };
  }

  const newUser = await model.createUser({ name, email, password });

  return newUser;
};

module.exports = {
  createUser,
};
