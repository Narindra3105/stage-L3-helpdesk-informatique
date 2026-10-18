const categorieModel = require('../models/categorie.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

exports.getAll = async (req, res) =>{
    const categorie = await categorieModel.findAll();
    res.json(categorie);
};

exports.getOne = async (req, res) =>{
    const categorie = await categorieModel.findById(req.params.id);
    if(!categorie){
        throw new AppError('Categorie introuvable',404);
    }
    res.json(categorie);
};

exports.create = async (req, res) => {
    try {
        const categorie = await categorieModel.create(req.body);
        res.status(201).json(categorie);
    } catch (err) {
        handleDbError(err, { duplicate: 'Une categorie avec ce nom existe déjà' });
    }
};

exports.update = async (req, res) => {
    const existante = await categorieModel.findById(req.params.id);
    if (!existante) {
        throw new AppError('Categorie introuvable', 404);
    }
    try {
        const categorie = await categorieModel.update(req.params.id, req.body);
        res.json(categorie);
    } catch (err) {
        handleDbError(err, { duplicate: 'Une categorie avec ce nom existe déjà' });
    }
};

exports.remove = async (req, res) => {
    const existante = await categorieModel.findById(req.params.id);
    if (!existante) {
        throw new AppError('Categorie introuvable', 404);
    }
    try {
        await categorieModel.remove(req.params.id);
        res.status(204).send();
    } catch (err) {
        handleDbError(err, { referenced: 'Cette categorie est utilisée par des tickets ou des articles' });
    }
};
