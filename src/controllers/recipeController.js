const service = require('../services/recipeService');

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

module.exports = {
  addRecipe,
};
