const ticketModel = require('../models/ticket.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const MESSAGES_DB = {
    referenced : 'Ce ticket est lié  à  des commentaires',
    missing: {
        fk_ticket_equipe:"L'équipe indiquée n'existe pas",
        fk_ticket_priorite:"La priorité indiquée n'existe pas",
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
    const {sujet, description, equipe_id, priorite_id} = req.body;
    try{
        const ticket = await ticketModel.create({
            sujet,
            description,
            equipe_id,
            priorite_id,
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