const { body, param, query } = require('express-validator');

const TYPES = ['public', 'interne'];

const idRule = [
    param('id')
        .isInt({ min: 1 }).withMessage("L'identifiant doit être un entier positif"),
];

const listeRules = [
    query('ticket_id')
        .notEmpty().withMessage('Le paramètre ticket_id est obligatoire').bail()
        .isInt({ min: 1 }).withMessage("L'identifiant du ticket doit être un entier positif"),
];

const champContenu = body('contenu')
    .trim()
    .notEmpty().withMessage('Le contenu est obligatoire').bail()
    .isString().withMessage('Le contenu doit être du texte').bail()
    .isLength({ max: 5000 }).withMessage('Le contenu ne doit pas dépasser 5000 caractères');

const creerCommentaireRules = [
    body('ticket_id')
        .notEmpty().withMessage('Le ticket est obligatoire').bail()
        .isInt({ min: 1 }).withMessage("L'identifiant du ticket doit être un entier positif")
        .toInt(),

    champContenu,

    body('type')
        .optional()
        .isIn(TYPES).withMessage(`Le type doit être : ${TYPES.join(', ')}`),
];

const modifierCommentaireRules = [champContenu];

module.exports = { idRule, listeRules, creerCommentaireRules, modifierCommentaireRules };