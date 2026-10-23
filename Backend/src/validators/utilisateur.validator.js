const { body, param } = require('express-validator');

const ROLES = ['admin', 'technicien', 'demandeur'];
const STATUTS = ['actif', 'absent', 'inactif'];

const idRule = [
  param('id')
    .isInt({ min: 1 })
    .withMessage("L'identifiant doit être un entier positif"),
];

const champsCommuns = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire').bail()
    .isLength({ max: 100 }).withMessage('Le nom ne doit pas dépasser 100 caractères'),

  body('prenom')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 }).withMessage('Le prénom ne doit pas dépasser 100 caractères'),

  body('email')
    .trim()
    .toLowerCase()
    .notEmpty().withMessage("L'email est obligatoire").bail()
    .isEmail().withMessage("Format d'email invalide").bail()
    .isLength({ max: 150 }).withMessage("L'email ne doit pas dépasser 150 caractères"),

  body('role')
    .optional()
    .isIn(ROLES).withMessage(`Le rôle doit être : ${ROLES.join(', ')}`),

  body('equipe_id')
    .optional({ values: 'null' })
    .isInt({ min: 1 }).withMessage("L'identifiant de l'équipe doit être un entier positif")
    .toInt(),

  body('statut')
    .optional()
    .isIn(STATUTS).withMessage(`Le statut doit être : ${STATUTS.join(', ')}`),
];

const creerUtilisateurRules = [
  ...champsCommuns,
  body('mdp')
    .notEmpty().withMessage('Le mot de passe est obligatoire').bail()
    .isString().withMessage('Le mot de passe doit être une chaîne de caractères').bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('Le mot de passe doit contenir entre 8 et 72 caractères'),
];

const modifierUtilisateurRules = champsCommuns;

module.exports = { idRule, creerUtilisateurRules, modifierUtilisateurRules };