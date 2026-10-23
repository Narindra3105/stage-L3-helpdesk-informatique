const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  idRule,
  creerUtilisateurRules,
  modifierUtilisateurRules,
} = require('../validators/utilisateur.validator');
const utilisateurController = require('../controllers/utilisateur.controller');

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/', utilisateurController.getAll);
router.get('/:id', idRule, validate, utilisateurController.getOne);
router.post('/', creerUtilisateurRules, validate, utilisateurController.create);
router.put('/:id', idRule, modifierUtilisateurRules, validate, utilisateurController.update);
router.delete('/:id', idRule, validate, utilisateurController.remove);

module.exports = router;