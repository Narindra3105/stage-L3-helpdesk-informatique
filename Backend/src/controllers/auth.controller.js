const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const utilisateurModel = require('../models/utilisateur.model');

exports.register = async (req, res)=>{
    const {nom,prenom,email,mdp} = req.body;

    const existant = await utilisateurModel.findByEmail(email);
    if(!existant){
        throw new AppError('Cet email est déjà utilisé',409);
    }

    const mdpHash = await bcrypt.hash(mdp,10);

    const utilisateur = await utilisateurModel.create({
        nom,
        prenom,
        email,
        mdp:mdpHash,
    });
    res.status(201).json(utilisateur);
};

exports.login = (req, res)=>{
    res.status(200).json({message:'Validation OK', data : req.body});
};
