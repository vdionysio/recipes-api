const model = require('../models/userModel');
const userSchema = require('../schemas/userSchema');
const loginSchema = require('../schemas/loginSchema');

const createUser = async ({ name, email, password }) => {
  const { error } = userSchema.validate({ name, email, password });

  if (error) return { message: error.message, statusCode: 400 };

  const user = await model.getByEmail(email);

  if (user) {
    return { message: 'Email already registered', statusCode: 409 };
  }

  const newUser = await model.createUser({ name, email, password });

  return newUser;
};

const login = async ({ email, password }) => {
  const { error } = loginSchema.validate({ email, password });

  if (error) {
    const message = error.message.includes('valid email')
      ? 'Incorrect username or password' : 'All fields must be filled';
    return {
      message,
      statusCode: 401,
    };
  }

  const user = await model.getByEmail(email);

  if (!user || user.password !== password) {
    return { message: 'Incorrect username or password', statusCode: 401 };
  }

  return user;
};

const createAdmin = async ({ name, email, password }, userFromToken) => {
  if (userFromToken.role !== 'admin') {
    return { message: 'Only admins can register new admins', statusCode: 403 };
  }

  const newAdmin = await model.createUser({ name, email, password }, 'admin');

  return newAdmin;
};

module.exports = {
  createUser,
  login,
  createAdmin,
};
