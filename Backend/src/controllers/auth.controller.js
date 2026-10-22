const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const utilisateurModel = require('../models/utilisateur.model');
const { genererToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { nom, prenom, email, mdp } = req.body;

  const existant = await utilisateurModel.findByEmail(email);
  if (existant) {
    throw new AppError('Cet email est déjà utilisé', 409);
  }

  const mdpHash = await bcrypt.hash(mdp, 10);

  const utilisateur = await utilisateurModel.create({
    nom,
    prenom,
    email,
    mdp: mdpHash,
  });

  res.status(201).json(utilisateur);
};

exports.login = async (req, res) => {
  const { email, mdp } = req.body;

  const utilisateur = await utilisateurModel.findByEmail(email);
  if (!utilisateur) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  const mdpValide = await bcrypt.compare(mdp, utilisateur.mdp);
  if (!mdpValide) {
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  if (utilisateur.statut === 'inactif') {
    throw new AppError('Compte désactivé', 403);
  }

  await utilisateurModel.updateDerniereActivite(utilisateur.id);

  const token = genererToken(utilisateur);

  res.status(200).json({
    message: 'Connexion réussie',
    token,
    utilisateur: {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role,
      equipe_id: utilisateur.equipe_id,
      statut: utilisateur.statut,
    },
  });
};