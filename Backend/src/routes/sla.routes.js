const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');
const {idRule, slaRules} = require('../validators/sla.validator');
const slaController = require('../controllers/sla.controller');

router.use(authMiddleware);

router.get('/',roleMiddleware('admin', 'technicien'),slaController.getAll);
router.get('/:id',roleMiddleware('admin', 'technicien'),idRule,validate,slaController.getOne);
router.post('/',roleMiddleware('admin'),slaRules,validate,slaController.create);
router.put('/:id',roleMiddleware('admin'),idRule,slaRules,validate,slaController.update);
router.delete('/:id',roleMiddleware('admin'),idRule,validate,slaController.remove);

module.exports=router;