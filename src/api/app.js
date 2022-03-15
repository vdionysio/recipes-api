const express = require('express');
const multer = require('multer');
const path = require('path');
const { join } = require('path');
const bodyParser = require('body-parser');

const routes = require('../routes');
const recipeController = require('../controllers/recipeController');
const validateJWT = require('../middlewares/validateJWT');
const handleError = require('../middlewares/error');

const app = express();

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '../index.html'));
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, join(__dirname, '..', 'uploads'));
  },

  filename: (req, _file, cb) => {
    const { id } = req.params;
    cb(null, `${id}.jpeg`);
  },
});

const upload = multer({ storage });

app.use('/users', routes.user);
app.use('/recipes', routes.recipe);
app.use('/login', routes.login);

app.put('/recipes/:id/image', validateJWT, upload.single('image'), recipeController.addImageById);

app.use(handleError);

module.exports = app;
