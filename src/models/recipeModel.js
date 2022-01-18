const { ObjectId } = require('mongodb');
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

const getById = async (id) => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const recipe = await recipeCollection.findOne({ _id: ObjectId(id) });

  return recipe;
};

const updateById = async ({ name, ingredients, preparation }, id) => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const result = await recipeCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { name, ingredients, preparation } },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return { _id: id, name, ingredients, preparation };
};

const deleteById = async (id) => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const result = await recipeCollection.removeOne(
    { _id: ObjectId(id) },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return true;
};

const addImageById = async (imageUrl, id) => {
  const recipeCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('recipes'));

  const result = await recipeCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { image: imageUrl } },
    { returnOriginal: false },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  const recipe = await getById(id);

  return recipe;
};

module.exports = {
  addRecipe,
  getAll,
  getById,
  updateById,
  deleteById,
  addImageById,
};
