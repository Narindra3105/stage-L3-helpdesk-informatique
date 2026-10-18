const router = require('express').Router();

const validate = require('../middlewares/validate.middleware');
const {idRule, statutRules} = require('../validators/statut.validator');
const statutController = require('../controllers/statut.controller');

router.get('/',statutController.getAll);
router.get('/:id',idRule,validate,statutController.getOne);
router.post('/',statutRules,validate,statutController.create);
router.put('/:id',idRule,statutRules,validate,statutController.update);
router.delete('/:id',idRule,validate,statutController.remove);

module.exports= router;