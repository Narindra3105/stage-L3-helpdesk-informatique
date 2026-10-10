const router = require ('express').Router();

const validate = require ('../middlewares/validate.middleware');
const {registerRules, loginRules}= require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules,validate,authController.login);

module.exports = router;