const router=require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');
const {idRule, prioriteRules}=require('../validators/priorite.validator');
const prioriteController = require('../controllers/priorite.controller');

router.use(authMiddleware);

router.get('/',prioriteController.getAll);
router.get('/:id',idRule,validate,prioriteController.getOne);
router.post('/',roleMiddleware('admin'),prioriteRules,validate,prioriteController.create);
router.put('/:id',roleMiddleware('admin'),idRule,prioriteRules,validate,prioriteController.update);
router.delete('/:id',roleMiddleware('admin'),idRule,validate,prioriteController.remove);

module.exports = router;