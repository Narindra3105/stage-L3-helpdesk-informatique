const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const statsController = require('../controllers/stats.controller');

router.use(authMiddleware);

router.get('/dashboard', roleMiddleware('admin', 'technicien'), statsController.getDashboard);
router.get('/techniciens', roleMiddleware('admin'), statsController.getTechniciens);
router.get('/sla', roleMiddleware('admin'), statsController.getRapportSla);

module.exports = router;