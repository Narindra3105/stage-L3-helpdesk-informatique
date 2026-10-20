const {body, param}= require('express-validator');

const idRule = [
    param('id')
        .isInt({min:1})
        .withMessage("L'identifiant doit être un entier positif"),
];

const slaRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage("Le nom de SLA est obligatoire")
        .isLength({max:100}).withMessage("Le nom ne doit pas depasser de 100 caractères"),
    
    body('priorite_id')
        .isInt({min:1}).withMessage("L'identifiant de la priorité est obligatoire(entier positif"),
    
    body('equipe_id')
        .optional({values:'null'})
        .isInt({min:1}).withMessage("L'identifiant de l'équipe doit être un entier positif"),

    body('delai_premiere_reponse_min')
        .isInt({min:1}).withMessage("Le delai de premiere reponse est obligatoire (minutes, entier positif"),

    body('delai_resolution_min')
        .isInt({ min: 1 }).withMessage('Le délai de résolution est obligatoire (minutes, entier positif)')
        .bail()
        .custom((value, { req }) => Number(value) >= Number(req.body.delai_premiere_reponse_min))
        .withMessage('Le délai de résolution doit être supérieur ou égal au délai de première réponse'),
];

module.exports = {idRule,slaRules};