const {body,param}=require('express-validator');

const idRule = [
    param('id')
        .isInt({min:1}).withMessage("L'identifiant doit être un entier positif"),
];

const champsTexte = [
    body('sujet')
        .trim()
        .notEmpty().withMessage('Le sujet est obligatoire').bail()
        .isLength({max:200}).withMessage('Le sujet ne doit pas dépasser 200 caractères'),
    
    body('description')
        .optional({values:'null'})
        .trim()
        .isString().withMessage('La description doit être du texte'),
];

const champsReferences = [
    body('equipe_id')
        .notEmpty().withMessage("L'équipe est obligatoire").bail()
        .isInt({min:1}).withMessage("L'identifiant de l'équipe doit être un entier positif")
        .toInt(),

    body('priorite_id')
        .notEmpty().withMessage("La priorité est obligatoire").bail()
        .isInt({min:1}).withMessage("L'identifiant de la priorité doit être un entier positif")
        .toInt(),
];
const assignationRules = [
    body('technicien_id').custom((value) => {
        if (value === null) return true;
        if (Number.isInteger(value) && value >= 1) return true;
        throw new Error(
            'technicien_id doit être un entier positif, ou null pour retirer le technicien'
        );
    }),
];
const changementStatutRules = [
    body('statut_id')
        .notEmpty().withMessage('Le statut est obligatoire').bail()
        .isInt({min:1}).withMessage("L'identifiant du statut doit être un entier positif")
        .toInt(),
];
const creerTicketRules = [...champsTexte, ...champsReferences];

const modifierTicketRules = champsTexte;

module.exports = {idRule, creerTicketRules, modifierTicketRules,assignationRules,changementStatutRules};

