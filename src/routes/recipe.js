const router = require('express').Router();
const recipeController = require('../controllers/recipeController');
const validateJWT = require('../middlewares/validateJWT');

router.post('/', validateJWT, recipeController.addRecipe);
router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getById);
router.put('/:id', validateJWT, recipeController.updateById);
router.delete('/:id', validateJWT, recipeController.deleteById);

module.exports = router;