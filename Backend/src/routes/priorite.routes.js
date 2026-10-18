const router=require('express').Router();

const validate = require('../middlewares/validate.middleware');
const {idRule, prioriteRules}=require('../validators/priorite.validator');
const prioriteController = require('../controllers/priorite.controller');

router.get('/',prioriteController.getAll);
router.get('/:id',idRule,validate,prioriteController.getOne);
router.post('/', prioriteRules,validate,prioriteController.create);
router.put('/:id',idRule,prioriteRules,validate,prioriteController.update);
router.delete('/:id',idRule,validate,prioriteController.remove);

module.exports = router;