const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');
const {idRule, equipeRules}=require('../validators/equipe.validator');
const equipeController = require('../controllers/equipe.controller');

router.use(authMiddleware);

router.get('/',equipeController.getAll);
router.get('/:id',idRule,validate,equipeController.getOne);
router.post('/',roleMiddleware('admin'),equipeRules,validate,equipeController.create);
router.put('/:id',roleMiddleware('admin'),idRule,equipeRules,validate,equipeController.update);
router.delete('/:id',roleMiddleware('admin'),idRule,validate,equipeController.remove);

module.exports=router;