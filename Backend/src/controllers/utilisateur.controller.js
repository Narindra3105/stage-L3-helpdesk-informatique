const bcrypt = require('bcrypt');
const utilisateurModel = require('../models/utilisateur.model');
const AppError = require('../utils/AppError');
const handleDbError = require('../utils/handleDbError');

const MESSAGES_DB = {
  duplicate: 'Cet email est déjà utilisé',
  referenced: 'Cet utilisateur est lié à des tickets ou à des commentaires',
  missing: { fk_utilisateur_equipe: "L'équipe indiquée n'existe pas" },
};

exports.getAll = async (req, res) => {
  const utilisateurs = await utilisateurModel.findAll();
  res.json(utilisateurs);
};

exports.getOne = async (req, res) => {
  const utilisateur = await utilisateurModel.findById(req.params.id);
  if (!utilisateur) {
    throw new AppError('Utilisateur introuvable', 404);
  }
  res.json(utilisateur);
};

exports.create = async (req, res) => {
  const { nom, prenom, email, mdp, role, equipe_id, statut } = req.body;

  const mdpHash = await bcrypt.hash(mdp, 10);

  try {
    const utilisateur = await utilisateurModel.create({
      nom,
      prenom: prenom || null,
      email,
      mdp: mdpHash,
      role,
      equipe_id,
      statut,
    });
    res.status(201).json(utilisateur);
  } catch (err) {
    handleDbError(err, MESSAGES_DB);
  }
};

exports.update = async (req, res) => {
  const existant = await utilisateurModel.findById(req.params.id);
  if (!existant) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  const { nom, prenom, email, role, equipe_id, statut } = req.body;

  if (Number(req.params.id) === req.user.id) {
    const roleChange = role !== undefined && role !== existant.role;
    const statutChange = statut !== undefined && statut !== existant.statut;
    if (roleChange || statutChange) {
      throw new AppError('Vous ne pouvez pas modifier votre propre rôle ou statut', 400);
    }
  }

  try {
    const utilisateur = await utilisateurModel.update(req.params.id, {
      nom,
      prenom: prenom !== undefined ? prenom || null : existant.prenom,
      email,
      role: role ?? existant.role,
      equipe_id: equipe_id !== undefined ? equipe_id : existant.equipe_id,
      statut: statut ?? existant.statut,
    });
    res.json(utilisateur);
  } catch (err) {
    handleDbError(err, MESSAGES_DB);
  }
};

exports.remove = async (req, res) => {
  const existant = await utilisateurModel.findById(req.params.id);
  if (!existant) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  if (Number(req.params.id) === req.user.id) {
    throw new AppError('Vous ne pouvez pas supprimer votre propre compte', 400);
  }

  try {
    await utilisateurModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    handleDbError(err, MESSAGES_DB);
  }
};