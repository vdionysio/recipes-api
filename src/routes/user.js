const router = require('express').Router();
const userController = require('../controllers/userController');
const validateJWT = require('../middlewares/validateJWT');

router.post('/', userController.createUser);
router.post('/admin', validateJWT, userController.createAdmin);

module.exports = router;