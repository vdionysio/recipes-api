const model = require('../models/recipeModel');
const userModel = require('../models/userModel');
const recipeSchema = require('../schemas/recipeSchema');

const addRecipe = async ({ name, ingredients, preparation }, email) => {
  const { error } = recipeSchema.validate({ name, ingredients, preparation });
  if (error) return { message: 'Invalid entries. Try again.', statusCode: 400 };

  const user = await userModel.getByEmail(email);

  const { _id } = user;
  const recipe = await model.addRecipe({ name, ingredients, preparation }, _id);

  return recipe;
};

module.exports = {
  addRecipe,
};
