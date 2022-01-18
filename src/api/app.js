const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const recipeController = require('../controllers/recipeController');
const validateJWT = require('../middlewares/validateJWT');
const handleError = require('../middlewares/error');

const app = express();

app.use(bodyParser.json());
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', userController.createUser);
app.post('/login', userController.login);
app.post('/recipes', validateJWT, recipeController.addRecipe);
app.get('/recipes', recipeController.getAll);
app.get('/recipes/:id', recipeController.getById);
app.put('/recipes/:id', validateJWT, recipeController.updateById);

app.use(handleError);
module.exports = app;
