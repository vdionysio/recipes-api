const Joi = require('joi');

// const STD_MSG = 'Invalid entries. Try again.';

module.exports = Joi.object({
  name: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required(),
});