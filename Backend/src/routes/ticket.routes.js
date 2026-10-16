const router = require('express').Router();
const ticketController = require('../controllers/ticket.controller');

router.get('/:id',ticketController.getTicket);

module.exports = router;