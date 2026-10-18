const {body,param}= require('express-validator');

const idRule = [
    param('id')
        .isInt({min:1})
        .withMessage("L'indetifiant doit être un entier positif"),
];

const equipeRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage("Le nom de l'équipe est obligatoire")
        .isLength({max:100}).withMessage('Le nom ne doit pas dépasser 100 caractères'),

    body('description')
        .optional({values:'null'})
        .trim()
        .isLength({max:255}).withMessage('La description ne doit pas dépasser 255 caractères'),
];

module.exports = {idRule,equipeRules};