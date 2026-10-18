const equipeModel = require('../models/equipe.model');
const AppError = require('../utils/AppError');

exports.getAll = async (req,res)=>{
    const equipes = await equipeModel.findAll();
    res.json(equipes);
}

exports.getOne = async (req, res)=> {
    const equipe = await equipeModel.findById(req.params.id);
    if (!equipe){
        throw new AppError('Équipe introuvable',404);
    }
    res.json(equipe);
};

exports.create = async (req, res)=>{
    const equipe = await equipeModel.create(req.body);
    res.status(201).json(equipe);
};

exports.update = async (req, res)=>{
    const existante = await equipeModel.findById(req.params.id);
    if(!existante){
        throw new AppError('Équipe introuvable',404);
    }
    const equipe = await equipeModel.update(req.params.id, req.body);
    res.json(equipe);
};


exports.remove = async (req, res)=>{
    const existante = await equipeModel.findById(req.params.id);
    if(!existante){
        throw new AppError('Équipe introuvable',404);
    }
    const equipe = await equipeModel.remove(req.params.id);
    res.status(204).send();
}