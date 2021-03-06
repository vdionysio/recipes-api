const { join } = require('path');
const rescue = require('express-rescue');
const service = require('../services/recipeService');
const model = require('../models/recipeModel');

const addRecipe = rescue(async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { email } = req.user;

  const recipe = await service.addRecipe({ name, ingredients, preparation }, email);

  if (recipe.statusCode) {
    return res
      .status(recipe.statusCode).json({ message: recipe.message });
  }

  res.status(201).json({ recipe });
});

const getAll = rescue(async (req, res) => {
  const recipes = await model.getAll();

  res.status(200).json(recipes);
});

const getById = rescue(async (req, res) => {
  const { id } = req.params;

  const recipe = await service.getById(id);

  if (recipe.statusCode) {
    return res
      .status(recipe.statusCode).json({ message: recipe.message });
  }

  res.status(200).json(recipe);
});

const updateById = rescue(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { name, ingredients, preparation } = req.body;

  const result = await service
    .updateById({ name, ingredients, preparation }, id, user);

  if (result.statusCode) {
    return res
      .status(result.statusCode).json({ message: result.message });
  }

  res.status(200).json(result);
});

const deleteById = rescue(async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const result = await service
    .deleteById(id, user);

  if (result.statusCode) {
    return res
      .status(result.statusCode).json({ message: result.message });
  }

  res.status(204).send();
});

const addImageById = rescue(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { filename } = req.file;
  const imagePath = join('localhost:3000', 'src', 'uploads', filename);

  const result = await service
    .addImageById(imagePath, id, user);

  if (result.statusCode) {
    return res
      .status(result.statusCode).json({ message: result.message });
  }

  res.status(200).json(result);
});

module.exports = {
  addRecipe,
  getAll,
  getById,
  updateById,
  deleteById,
  addImageById,
};
