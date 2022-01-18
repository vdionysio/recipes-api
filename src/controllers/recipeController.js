const service = require('../services/recipeService');
const model = require('../models/recipeModel');

const addRecipe = async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { email } = req.user;

  // aqui a zica
  const recipe = await service.addRecipe({ name, ingredients, preparation }, email);

  if (recipe.statusCode) {
    return res
      .status(recipe.statusCode).json({ message: recipe.message });
  }

  res.status(201).json({ recipe });
};

const getAll = async (req, res) => {
  const recipes = await model.getAll();

  res.status(200).json(recipes);
};

module.exports = {
  addRecipe,
  getAll,
};
