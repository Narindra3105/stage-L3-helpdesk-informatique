const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    idRule,
    listeRules,
    creerArticleRules,
    modifierArticleRules,
} = require('../validators/article.validator');
const articleController = require('../controllers/article.controller');

router.use(authMiddleware);

router.get('/', listeRules, validate, articleController.getAll);
router.get('/:id', idRule, validate, articleController.getOne);

router.post(
    '/',
    roleMiddleware('admin', 'technicien'),
    creerArticleRules,
    validate,
    articleController.create
);
router.put(
    '/:id',
    roleMiddleware('admin', 'technicien'),
    idRule,
    modifierArticleRules,
    validate,
    articleController.update
);
router.delete(
    '/:id',
    roleMiddleware('admin', 'technicien'),
    idRule,
    validate,
    articleController.remove
);

module.exports = router;