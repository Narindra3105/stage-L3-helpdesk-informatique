const prioriteModel = require('../models/priorite.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

exports.getAll = async (req, res) =>{
    const priorite = await prioriteModel.findAll();
    res.json(priorite);
};

exports.getOne = async (req, res) =>{
    const priorite = await prioriteModel.findById(req.params.id);
    if(!priorite){
        throw new AppError('Priorité introuvable',404);
    }
    res.json(priorite);
};

exports.create = async (req, res) => {
    try {
        const priorite = await prioriteModel.create(req.body);
        res.status(201).json(priorite);
    } catch (err) {
        handleDbError(err, { duplicate: 'Une priorite avec ce nom existe déjà' });
    }
};

exports.update = async (req, res) => {
    const existante = await prioriteModel.findById(req.params.id);
    if (!existante) {
        throw new AppError('Priorité introuvable', 404);
    }
    try {
        const priorite = await prioriteModel.update(req.params.id, req.body);
        res.json(priorite);
    } catch (err) {
        handleDbError(err, { duplicate: 'Une priorite avec ce nom existe déjà' });
    }
};

exports.remove = async (req, res) => {
    const existante = await prioriteModel.findById(req.params.id);
    if (!existante) {
        throw new AppError('Priorité introuvable', 404);
    }
    try {
        await prioriteModel.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        handleDbError(err, { referenced: 'Cette priorité est utilisée par des tickets' });
    }
};