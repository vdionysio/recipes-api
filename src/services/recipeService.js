const { ObjectId } = require('mongodb');
const model = require('../models/recipeModel');
const userModel = require('../models/userModel');
const recipeSchema = require('../schemas/recipeSchema');

const recipeNotFound = { message: 'recipe not found', statusCode: 404 };
const accessDenied = { message: 'you dont have access', statusCode: 401 };

const addRecipe = async ({ name, ingredients, preparation }, email) => {
  const { error } = recipeSchema.validate({ name, ingredients, preparation });
  if (error) return { message: error.message, statusCode: 400 };

  const user = await userModel.getByEmail(email);

  const { _id } = user;
  const recipe = await model.addRecipe({ name, ingredients, preparation }, _id);

  return recipe;
};

const getById = async (id) => {
  if (!ObjectId.isValid(id)) {
    return recipeNotFound;
  }

  const recipe = await model.getById(id);

  if (!recipe) {
    return recipeNotFound;
  }

  return recipe;
};

const updateById = async ({ name, ingredients, preparation }, recipeId, userFromToken) => {
  if (!ObjectId.isValid(recipeId)) {
    return recipeNotFound;
  }

  const recipe = await model.getById(recipeId);

  if (!recipe) {
    return recipeNotFound;
  }

  const { _id: authUserId } = await userModel.getByEmail(userFromToken.email);

  console.log(authUserId, recipe);
  if (authUserId.toString() !== recipe.userId.toString() && userFromToken.role !== 'admin') {
    return accessDenied;
  }

  const updatedRecipe = await model.updateById({ name, ingredients, preparation }, recipeId);

  return { ...updatedRecipe, userId: authUserId };
};

const deleteById = async (recipeId, userFromToken) => {
  if (!ObjectId.isValid(recipeId)) {
    return recipeNotFound;
  }

  const recipe = await model.getById(recipeId);

  if (!recipe) {
    return recipeNotFound;
  }

  const { _id: authUserId } = await userModel.getByEmail(userFromToken.email);

  if (authUserId.toString() !== recipe.userId.toString() && userFromToken.role !== 'admin') {
    return accessDenied;
  }

  const isDeleted = await model.deleteById(recipeId);

  return isDeleted;
};

const addImageById = async (path, id, userFromToken) => {
  if (!ObjectId.isValid(id)) {
    return recipeNotFound;
  }

  const recipe = await model.getById(id);

  if (!recipe) {
    return recipeNotFound;
  }

  const { _id: authUserId } = await userModel.getByEmail(userFromToken.email);

  if (authUserId.toString() !== recipe.userId.toString() && userFromToken.role !== 'admin') {
    return accessDenied;
  }
 
  const updatedRecipe = await model.addImageById(path, id);

  return updatedRecipe;
};

module.exports = {
  addRecipe,
  getById,
  updateById,
  deleteById,
  addImageById,
};
