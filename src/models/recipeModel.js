const mongoConnection = require('./connection');

const addRecipe = async ({ name, ingredients, preparation }, userId) => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const { insertedId: _id } = await recipeCollection
    .insertOne({ name, ingredients, preparation, userId });

  return {
    name,
    ingredients,
    preparation,
    userId,
    _id,
  };
};

const getAll = async () => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const recipes = await recipeCollection.find().toArray();

  return recipes;
};

module.exports = {
  addRecipe,
  getAll,
};
