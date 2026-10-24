const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    idRule,
    listeRules,
    creerCommentaireRules,
    modifierCommentaireRules,
} = require('../validators/commentaire.validator');
const commentaireController = require('../controllers/commentaire.controller');

router.use(authMiddleware);

router.get('/', listeRules, validate, commentaireController.getByTicket);
router.get('/:id', idRule, validate, commentaireController.getOne);
router.post('/', creerCommentaireRules, validate, commentaireController.create);
router.put('/:id', idRule, modifierCommentaireRules, validate, commentaireController.update);
router.delete('/:id', idRule, validate, commentaireController.remove);

module.exports = router;