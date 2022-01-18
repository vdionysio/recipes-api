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

module.exports = {
  addRecipe,
};
