const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  profilRules,
  disponibiliteRules,
  motDePasseRules,
} = require('../validators/profil.validator');
const profilController = require('../controllers/profil.controller');

router.use(authMiddleware);

router.get('/', profilController.getProfil);
router.put('/', profilRules, validate, profilController.updateProfil);
router.patch(
  '/disponibilite',
  roleMiddleware('technicien'),
  disponibiliteRules,
  validate,
  profilController.changerDisponibilite
);
router.patch('/mdp', motDePasseRules, validate, profilController.changerMdp);

module.exports = router;