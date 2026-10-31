const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const utilisateurController = require('../controllers/utilisateur.controller');

router.use(authMiddleware);

router.get(
  '/actifs',
  roleMiddleware('admin', 'technicien'),
  utilisateurController.getTechniciensActifs
);

module.exports = router;