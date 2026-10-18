const router = require('express').Router();

const validate = require('../middlewares/validate.middleware');
const {idRule, equipeRules}=require('../validators/equipe.validator');
const equipeController = require('../controllers/equipe.controller');

router.get('/',equipeController.getAll);
router.get('/:id',idRule,validate,equipeController.getOne);
router.post('/',equipeRules,validate,equipeController.create);
router.put('/:id',idRule,equipeRules,validate,equipeController.update);
router.delete('/:id',idRule,validate,equipeController.remove);

module.exports=router;