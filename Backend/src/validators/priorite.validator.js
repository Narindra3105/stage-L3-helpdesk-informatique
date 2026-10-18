const {body,params}=require('express-validator');

const idRule = [
    param('id')
        .isInt({min:1})
        .withMessage("L'indetifiant doit être un entier positif"),
];

const prioriteRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom de priorite est obligatoire')
        .isLength({max:50}).withMessage('Le nom ne doit pas dépasser 50 caractères'),
    
    body('niveau_ordre')
        .exists({values:'falsy'}).withMessage("Le niveau d'ordre est obligatoire")
        .bail()
        .isInt({min:1,max:255}).withMessage("L'ordre doit être un entier entre 1 et 255"),

    body('couleur')
        .optional({values:'null'})
        .trim()
        .isLength({max:20}).withMessage('Le couleur ne doit pas dépasser 20 caractères'),
];

module.exports = {idRule, prioriteRules};