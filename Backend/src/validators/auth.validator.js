const { body } = require('express-validator');

const registerRules = [
    body('nom')
        .trim()
        .notEmpty().withMessage('Le nom est obligatoire').bail()
        .isLength({ max: 100 }).withMessage('Le nom ne doit pas dépasser 100 caractères'),

    body('prenom')
        .optional({ values: 'falsy' })
        .trim()
        .isLength({ max: 100 }).withMessage('Le prénom ne doit pas dépasser 100 caractères'),

    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage("L'email est obligatoire").bail()
        .isEmail().withMessage("Format d'email invalide").bail()
        .isLength({ max: 150 }).withMessage("L'email ne doit pas dépasser 150 caractères"),

    body('mdp')
        .notEmpty().withMessage('Le mot de passe est obligatoire').bail()
        .isString().withMessage('Le mot de passe doit être une chaîne de caractères').bail()
        .isLength({ min: 8, max: 72 })
        .withMessage('Le mot de passe doit contenir entre 8 et 72 caractères'),
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

module.exports = { registerRules, loginRules };