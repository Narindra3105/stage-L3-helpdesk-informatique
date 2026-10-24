const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  idRule,
  creerTicketRules,
  modifierTicketRules,
  assignationRules,
} = require('../validators/ticket.validator');
const ticketController = require('../controllers/ticket.controller');

router.use(authMiddleware);

router.get('/', ticketController.getAll);
router.get('/:id', idRule, validate, ticketController.getOne);
router.post('/', creerTicketRules, validate, ticketController.create);

router.put(
  '/:id',
  roleMiddleware('admin'),
  idRule,
  modifierTicketRules,
  validate,
  ticketController.update
);
router.patch(
  '/:id/assignation',
  roleMiddleware('admin'),
  idRule,
  assignationRules,
  validate,
  ticketController.assigner
);
router.delete(
  '/:id',
  roleMiddleware('admin'),
  idRule,
  validate,
  ticketController.remove
);

module.exports = router;