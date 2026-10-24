const { body, param, query } = require('express-validator');

const STATUTS = ['publie', 'brouillon'];

const idRule = [
    param('id')
        .isInt({ min: 1 }).withMessage("L'identifiant doit être un entier positif"),
];

const listeRules = [
    query('categorie_id')
        .optional()
        .isInt({ min: 1 }).withMessage("L'identifiant de la catégorie doit être un entier positif"),
];

const champsArticle = [
    body('titre')
        .trim()
        .notEmpty().withMessage('Le titre est obligatoire').bail()
        .isLength({ max: 200 }).withMessage('Le titre ne doit pas dépasser 200 caractères'),

    body('contenu')
        .trim()
        .notEmpty().withMessage('Le contenu est obligatoire').bail()
        .isString().withMessage('Le contenu doit être du texte'),

    body('categorie_id')
        .notEmpty().withMessage('La catégorie est obligatoire').bail()
        .isInt({ min: 1 }).withMessage("L'identifiant de la catégorie doit être un entier positif")
        .toInt(),

    body('statut')
        .optional()
        .isIn(STATUTS).withMessage(`Le statut doit être : ${STATUTS.join(', ')}`),
];

const creerArticleRules = champsArticle;
const modifierArticleRules = champsArticle;

module.exports = { idRule, listeRules, creerArticleRules, modifierArticleRules };