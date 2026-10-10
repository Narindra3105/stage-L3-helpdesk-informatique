const {body}=require('express-validator');

const registerRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est obligatoire')
        .isLength({ max:100}).withMessage('Le nom ne doit pas dépasser 100 caractères'),

    body('prenom')
        .isLength({ max:100}).withMessage('Le nom ne doit pas dépasser 100 caractères'),
   
    body ('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("L'email est obligatoire").bail()
        .isEmail().withMessage("Format d'email invalide")
        .isLength({max:150}).withMessage("L'email ne doit pas dépasser 150 caractères "),
    
    body('mdp')
        .notEmpty().withMessage('Le mot de passe est obligatoire').bail()
        .isLength({min:8}).withMessage('Le mot de passe doit contenir au moins 8 caractères'),

    body('role')
        .optional()
        .isIn(['admin','technicien','demandeur'])
        .withMessage('Rôle invalide (admin,technicien ou demandeur)'),
];

const loginRules = [
    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("L'email est obligatoire").bail()
        .isEmail().withMessage("Format d'email invalide"),

    body('mdp')
        .notEmpty().withMessage('Le mot de passe est obligatoire'),
];

module.exports = {registerRules, loginRules};