const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');
const {idRule, categorieRules}=require('../validators/categorie.validator');
const categorieController = require('../controllers/categorie.controller');

router.use(authMiddleware);

router.get('/',categorieController.getAll);
router.get('/:id',idRule,validate,categorieController.getOne);
router.post('/',roleMiddleware('admin'),categorieRules,validate,categorieController.create);
router.put('/:id',roleMiddleware('admin'),idRule,categorieRules,validate,categorieController.update);
router.delete('/:id',roleMiddleware('admin'),idRule,validate,categorieController.remove);

module.exports=router;