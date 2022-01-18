const express = require('express');
const multer = require('multer');
const path = require('path');
const { join } = require('path');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const recipeController = require('../controllers/recipeController');
const validateJWT = require('../middlewares/validateJWT');
const handleError = require('../middlewares/error');

const app = express();

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.use(bodyParser.json());
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

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

app.post('/users', userController.createUser);
app.post('/login', userController.login);
app.post('/recipes', validateJWT, recipeController.addRecipe);
app.get('/recipes', recipeController.getAll);
app.get('/recipes/:id', recipeController.getById);
app.put('/recipes/:id', validateJWT, recipeController.updateById);
app.delete('/recipes/:id', validateJWT, recipeController.deleteById);
app.put('/recipes/:id/image', validateJWT, upload.single('image'), recipeController.addImageById);
app.use(handleError);
module.exports = app;
