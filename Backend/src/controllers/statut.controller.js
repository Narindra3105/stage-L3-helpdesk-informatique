const statutModel = require('../models/statut.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

exports.getAll = async (req, res) =>{
    const statuts = await statutModel.findAll();
    res.json(statuts);
};

exports.getOne = async (req, res) =>{
    const statut = await statutModel.findById(req.params.id);
    if(!statut){
        throw new AppError('Statut introuvable',404);
    }
    res.json(statut);
};

exports.create = async (req, res) => {
    try {
        const statut = await statutModel.create(req.body);
        res.status(201).json(statut);
    } catch (err) {
        handleDbError(err, { duplicate: 'Un statut avec ce nom existe déjà' });
    }
};

exports.update = async (req, res) => {
    const existant = await statutModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Statut introuvable', 404);
    }
    try {
        const statut = await statutModel.update(req.params.id, req.body);
        res.json(statut);
    } catch (err) {
        handleDbError(err, { duplicate: 'Un statut avec ce nom existe déjà' });
    }
};

exports.remove = async (req, res) => {
    const existant = await statutModel.findById(req.params.id);
    if (!existant) {
        throw new AppError('Statut introuvable', 404);
    }
    try {
        await statutModel.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        handleDbError(err, { referenced: 'Ce statut est utilisé par des tickets' });
    }
};