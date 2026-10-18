const {body,param}= require('express-validator');

const idRule = [
    param('id')
        .isInt({min:1})
        .withMessage("L'indetifiant doit être un entier positif"),
];

const statutRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom de statut est obligatoire')
        .isLength({max:50}).withMessage('Le nom ne doit pas dépasser 50 caractères'),
    
    body('ordre')
        .isInt({min:1,max:255}).withMessage("L'ordre doit être un entier entre 1 et 255"),

    body('est_final')
        .optional()
        .isBoolean().withMessage('est_final doit être un booléen'),
];

module.exports = {idRule, statutRules};