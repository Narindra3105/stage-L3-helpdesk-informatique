const router = require('express').Router();

const validate = require('../middlewares/validate.middleware');
const {idRule, slaRules} = require('../validators/sla.validator');
const slaController = require('../controllers/sla.controller');

router.get('/',slaController.getAll);
router.get('/:id',idRule,validate,slaController.getOne);
router.post('/',slaRules,validate,slaController.create);
router.put('/:id',idRule,slaRules,validate,slaController.update);
router.delete('/:id',idRule,validate,slaController.remove);

module.exports=router;