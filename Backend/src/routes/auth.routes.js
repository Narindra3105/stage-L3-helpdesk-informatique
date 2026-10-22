const router = require ('express').Router();

const validate = require ('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const {registerRules, loginRules}= require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules,validate,authController.login);

router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé', user: req.user });
});
module.exports = router;