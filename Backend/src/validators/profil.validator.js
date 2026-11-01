const { body } = require('express-validator');

const profilRules = [
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
];

const DISPONIBILITES = ['actif', 'absent'];

const disponibiliteRules = [
  body('statut')
    .isIn(DISPONIBILITES)
    .withMessage(`Le statut doit être : ${DISPONIBILITES.join(', ')}`),
];

const motDePasseRules = [
  body('mdp_actuel')
    .notEmpty().withMessage('Le mot de passe actuel est obligatoire').bail()
    .isString().withMessage('Le mot de passe actuel doit être une chaîne de caractères'),

  body('nouveau_mdp')
    .notEmpty().withMessage('Le nouveau mot de passe est obligatoire').bail()
    .isString().withMessage('Le nouveau mot de passe doit être une chaîne de caractères').bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('Le mot de passe doit contenir entre 8 et 72 caractères'),
];

module.exports = { profilRules, disponibiliteRules, motDePasseRules };