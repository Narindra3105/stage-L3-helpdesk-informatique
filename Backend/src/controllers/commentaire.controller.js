const commentaireModel = require('../models/commentaire.model');
const ticketModel = require('../models/ticket.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const MESSAGES_DB = {
    missing: {
        fk_commentaire_ticket: "Le ticket indiqué n'existe pas",
    },
};

const chargerTicketAccessible = async (ticketId, user) => {
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
        throw new AppError('Ticket introuvable', 404);
    }
    if (user.role === 'demandeur' && ticket.demandeur_id !== user.id) {
        throw new AppError('Accès refusé à ce ticket', 403);
    }
    return ticket;
};

exports.getByTicket = async (req, res) => {
    const ticketId = Number(req.query.ticket_id);

    await chargerTicketAccessible(ticketId, req.user);

    const publicOnly = req.user.role === 'demandeur';
    const commentaires = await commentaireModel.findByTicket(ticketId, { publicOnly });

    res.json(commentaires);
};

exports.getOne = async (req, res) => {
    const commentaire = await commentaireModel.findById(req.params.id);
    if (!commentaire) {
        throw new AppError('Commentaire introuvable', 404);
    }

    await chargerTicketAccessible(commentaire.ticket_id, req.user);

    if (req.user.role === 'demandeur' && commentaire.type === 'interne') {
        throw new AppError('Commentaire introuvable', 404);
    }

    res.json(commentaire);
};

exports.create = async (req, res) => {
    const { ticket_id, contenu, type } = req.body;

    await chargerTicketAccessible(ticket_id, req.user);

    if (type === 'interne' && req.user.role === 'demandeur') {
        throw new AppError('Un demandeur ne peut pas écrire de note interne', 403);
    }

    try {
        const commentaire = await commentaireModel.create({
            ticket_id,
            utilisateur_id: req.user.id,
            contenu,
            type,
        });
        res.status(201).json(commentaire);
    } catch (err) {
        handleDbError(err, MESSAGES_DB);
    }
};

exports.update = async (req, res) => {
    const existant = await commentaireModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Commentaire introuvable', 404);
    }

    if (existant.utilisateur_id !== req.user.id) {
        throw new AppError('Vous ne pouvez modifier que vos propres commentaires', 403);
    }

    const commentaire = await commentaireModel.update(req.params.id, {
        contenu: req.body.contenu,
    });

    res.json(commentaire);
};

exports.remove = async (req, res) => {
    const existant = await commentaireModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Commentaire introuvable', 404);
    }

    if (existant.utilisateur_id !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('Vous ne pouvez supprimer que vos propres commentaires', 403);
    }

    await commentaireModel.remove(req.params.id);
    res.status(204).send();
};