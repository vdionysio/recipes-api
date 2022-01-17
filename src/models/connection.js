const { MongoClient } = require('mongodb');
require('dotenv').config();

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const DB_NAME = 'Cookmaster';

const MONGO_DB_URL = `mongodb://${process.env.HOST || 'mongodb'}:27017/Cookmaster`;

let db = null;

function getConnection() {
  return db
  ? Promise.resolve(db)
  : MongoClient.connect(MONGO_DB_URL, OPTIONS).then((conn) => {
    db = conn.db(DB_NAME);
    return db;
  });
}

module.exports = { getConnection };