const mongoConnection = require('./connection');

const createUser = async ({ name, email, password }) => {
  const userCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const role = 'user';
  const { insertedId: _id } = await userCollection
    .insertOne({ name, email, password, role });

  return {
    name,
    email,
    role,
    _id,
  };
};

const getByEmail = async (email) => {
  const userCollection = await mongoConnection.getConnection()
    .then((db) => db.collection('users'));

  const user = await userCollection.findOne({ email });

  return user;
};

module.exports = {
  createUser,
  getByEmail,
};
