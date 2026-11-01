const bcrypt = require('bcrypt');
const utilisateurModel = require('../models/utilisateur.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const MESSAGES_DB = {
  duplicate: 'Cet email est déjà utilisé',
};

const chargerProfil = async (id) => {
  const utilisateur = await utilisateurModel.findById(id);
  if (!utilisateur) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  return utilisateur;
};

exports.getProfil = async (req, res) => {
  const utilisateur = await chargerProfil(req.user.id);
  res.json(utilisateur);
};

exports.updateProfil = async (req, res) => {
  const existant = await chargerProfil(req.user.id);
  const { nom, prenom, email } = req.body;

  try {
    await utilisateurModel.updateProfil(req.user.id, {
      nom,
      prenom: prenom !== undefined ? prenom || null : existant.prenom,
      email,
    });
  } catch (err) {
    handleDbError(err, MESSAGES_DB);
  }

  const utilisateur = await chargerProfil(req.user.id);
  res.json(utilisateur);
};

exports.changerDisponibilite = async (req, res) => {
  await chargerProfil(req.user.id);
  await utilisateurModel.updateStatut(req.user.id, req.body.statut);

  const utilisateur = await chargerProfil(req.user.id);
  res.json(utilisateur);
};

exports.changerMdp = async (req, res) => {
  const { mdp_actuel, nouveau_mdp } = req.body;

  const hash = await utilisateurModel.findMdpHash(req.user.id);
  if (!hash) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  const correct = await bcrypt.compare(mdp_actuel, hash);
  if (!correct) {
    throw new AppError('Le mot de passe actuel est incorrect', 400);
  }

  if (mdp_actuel === nouveau_mdp) {
    throw new AppError("Le nouveau mot de passe doit être différent de l'actuel", 400);
  }

  const nouveauHash = await bcrypt.hash(nouveau_mdp, 10);
  await utilisateurModel.changerMdp(req.user.id, nouveauHash);

  res.status(204).send();
};