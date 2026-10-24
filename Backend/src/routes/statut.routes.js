const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const validate = require('../middlewares/validate.middleware');
const {idRule, statutRules} = require('../validators/statut.validator');
const statutController = require('../controllers/statut.controller');

router.use(authMiddleware);

router.get('/',statutController.getAll);
router.get('/:id',idRule,validate,statutController.getOne);
router.post('/',roleMiddleware('admin'),statutRules,validate,statutController.create);
router.put('/:id',roleMiddleware('admin'),idRule,statutRules,validate,statutController.update);
router.delete('/:id',roleMiddleware('admin'),idRule,validate,statutController.remove);

module.exports= router;