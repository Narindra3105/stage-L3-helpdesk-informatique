const router = require('express').Router();

const validate = require('../middlewares/validate.middleware');
const {idRule, categorieRules}=require('../validators/categorie.validator');
const categorieController = require('../controllers/categorie.controller');

router.get('/',categorieController.getAll);
router.get('/:id',idRule,validate,categorieController.getOne);
router.post('/',categorieRules,validate,categorieController.create);
router.put('/:id',idRule,categorieRules,validate,categorieController.update);
router.delete('/:id',idRule,validate,categorieController.remove);

module.exports=router;