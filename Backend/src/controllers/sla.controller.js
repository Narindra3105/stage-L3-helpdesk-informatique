const slaModel = require('../models/sla.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const writeMessages = {
    duplicate: 'Un SLA existe déjà pour cette priorité et cette équipe',
    missing: {
        fk_sla_priorite: 'Priorité introuvable',
        fk_sla_equipe: 'Équipe introuvable',
    },
};

exports.getAll = async (req, res)=>{
    const slas = await slaModel.findAll();
    res.json(slas);
};

exports.getOne = async (req, res)=>{
    const sla = await slaModel.findById(req.params.id);
    if(!sla){
        throw new AppError("SLA introuvable",404);
    }
    res.json(sla);
};

exports.create = async(req, res)=>{
    if (await slaModel.findByPrioriteEquipe(req.body.priorite_id, req.body.equipe_id)) {
        throw new AppError(writeMessages.duplicate, 409);
    }
    try{
        const sla = await slaModel.create(req.body);
        res.status(201).json(sla);
    }catch(err){
        handleDbError(err,writeMessages);
    }
};

exports.update = async(req, res)=>{
    const existante = await slaModel.findById(req.params.id);
    if(!existante){
        throw new AppError('SLA introuvable',404);
    }
    if(await slaModel.findByPrioriteEquipe(req.body.priorite_id,req.body.equipe_id,req.params.id)){
        throw new AppError(writeMessages.duplicate, 409);
    }
    try{
        const sla = await slaModel.update(req.params.id,req.body);
        res.json(sla);
    }catch (err){
        handleDbError(err,writeMessages);
    }
};

exports.remove = async(req, res)=>{
    const existante = await slaModel.findById(req.params.id);
    if(!existante){
        throw new AppError('SLA introuvable',404);
    }
    try{
        await slaModel.remove(req.params.id);
        res.status(204).send();
    }catch(err){
        handleDbError(err,{referenced :'Ce SLA est utilisé par des tickets'});
    }
};