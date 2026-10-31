const ticketModel = require('../models/ticket.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');
const utilisateurModel = require('../models/utilisateur.model');
const statutModel = require('../models/statut.model');

const MESSAGES_DB = {
    referenced: 'Ce ticket est lié à des commentaires',
    missing: {
        fk_ticket_equipe:"L'équipe indiquée n'existe pas",
        fk_ticket_priorite:"La priorité indiquée n'existe pas",
        fk_ticket_categorie:"La catégorie indiquée n'existe pas",
    },
};

exports.getAll = async(req, res) => {
    const tickets = 
        req.user.role === 'demandeur'
            ? await ticketModel.findAll({demandeurId:req.user.id})
            : await ticketModel.findAll();

    res.json(tickets);
};

exports.getOne = async(req, res) =>{
    const ticket = await ticketModel.findById(req.params.id);
    if(!ticket){
        throw new AppError('Ticket introuvable', 404);
    }
    if(req.user.role === 'demandeur' && ticket.demandeur_id !== req.user.id){
        throw new AppError('Accès refusé à ce ticket', 403);
    }
    res.json(ticket);
};

exports.create = async(req, res) =>{
    const {sujet, description, equipe_id, priorite_id, categorie_id} = req.body;
    try{
        const ticket = await ticketModel.create({
            sujet,
            description,
            equipe_id,
            priorite_id,
            categorie_id,
            demandeur_id:req.user.id,
        });
        res.status(201).json(ticket);
    }catch(err){
        handleDbError(err, MESSAGES_DB);
    }
};

exports.update = async (req, res) => {
    const existant = await ticketModel.findById(req.params.id);
    if(!existant){
        throw new AppError('Ticket introuvable', 404);
    }
    const {sujet, description} = req.body;

    const ticket = await ticketModel.update(req.params.id, {
        sujet,
        description : description !== undefined ? description : existant.description,
    });

    res.json(ticket);
};
exports.assigner = async (req, res) => {
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket) {
        throw new AppError('Ticket introuvable', 404);
    }

    if (ticket.est_final) {
        throw new AppError("Impossible d'assigner un ticket clos", 409);
    }

    const { technicien_id } = req.body;

    if (technicien_id !== null) {
        const technicien = await utilisateurModel.findById(technicien_id);

        if (!technicien) {
            throw new AppError("Cet utilisateur n'existe pas", 400);
        }
        if (technicien.role !== 'technicien') {
            throw new AppError("Cet utilisateur n'est pas un technicien", 400);
        }
        if (technicien.statut !== 'actif') {
            throw new AppError(
                `Ce technicien n'est pas disponible (statut : ${technicien.statut})`,
                400
            );
        }
    }

    const ticketMaj = await ticketModel.assigner(ticket.id, technicien_id);
    res.json(ticketMaj);
};
exports.changerStatut = async (req, res) => {
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket) {
        throw new AppError('Ticket introuvable', 404);
    }

    if (req.user.role === 'technicien' && ticket.technicien_id !== req.user.id) {
        throw new AppError("Ce ticket ne vous est pas assigné", 403);
    }

    const { statut_id } = req.body;

    if (statut_id === ticket.statut_id) {
        throw new AppError('Le ticket a déjà ce statut', 400);
    }

    const nouveauStatut = await statutModel.findById(statut_id);
    if (!nouveauStatut) {
        throw new AppError("Ce statut n'existe pas", 400);
    }

    const [statutInitial] = await statutModel.findAll();
    const quitteLeStatutInitial = ticket.statut_id === statutInitial.id;

    if (quitteLeStatutInitial && ticket.technicien_id === null) {
        throw new AppError('Assignez un technicien avant de faire avancer ce ticket', 400);
    }

    const estFinalAvant = Boolean(ticket.est_final);
    const estFinalApres = Boolean(nouveauStatut.est_final);

    const ticketMaj = await ticketModel.changerStatut(ticket.id, nouveauStatut.id, {
        resolution: !estFinalAvant && estFinalApres,
        reouverture: estFinalAvant && !estFinalApres,
        premiereReponse: quitteLeStatutInitial,
    });

    res.json(ticketMaj);
};

exports.prendre = async (req, res) => {
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket) {
        throw new AppError('Ticket introuvable', 404);
    }

    if (ticket.est_final) {
        throw new AppError('Impossible de prendre un ticket clos', 409);
    }

    if (ticket.technicien_id !== null) {
        throw new AppError('Ce ticket a déjà été pris en charge', 409);
    }

    const technicien = await utilisateurModel.findById(req.user.id);
    if (!technicien || technicien.statut !== 'actif') {
        throw new AppError('Vous devez être disponible (statut actif) pour prendre un ticket', 400);
    }

    const pris = await ticketModel.prendre(ticket.id, req.user.id);
    if (!pris) {
        throw new AppError('Ce ticket a déjà été pris en charge', 409);
    }

    const ticketMaj = await ticketModel.findById(ticket.id);
    res.json(ticketMaj);
};

exports.remove = async (req, res) =>{
    const existant = await ticketModel.findById(req.params.id);
    if(!existant){
        throw new AppError('Ticket introuvable', 404);
    }
    try {
        await ticketModel.remove(req.params.id);
        res.status(204).send();
    }catch (err){
        handleDbError(err, MESSAGES_DB);
    }
};