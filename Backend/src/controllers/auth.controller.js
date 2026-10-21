const bcrypt = require('bcrypt');
const AppError = require('../utils/AppError');
const utilisateurModel = require('../models/utilisateur.model');

const login = async (req, res, next) => {
  try {
    const { email, mdp } = req.body;

    const [rows] = await db.query(
      `SELECT id, nom, prenom, email, mdp, role, equipe_id, statut
       FROM utilisateur
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const utilisateur = rows[0];

    const mdpValide = await bcrypt.compare(mdp, utilisateur.mdp);

    if (!mdpValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (utilisateur.statut === 'inactif') {
      return res.status(403).json({ message: 'Compte désactivé' });
    }

    await db.query(
      'UPDATE utilisateur SET derniere_activite = NOW() WHERE id = ?',
      [utilisateur.id]
    );

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
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res)=>{
    const {nom,prenom,email,mdp} = req.body;

    const existant = await utilisateurModel.findByEmail(email);
    if(!existant){
        throw new AppError('Cet email est déjà utilisé',409);
    }

    const mdpHash = await bcrypt.hash(mdp,10);

    const utilisateur = await utilisateurModel.create({
        nom,
        prenom,
        email,
        mdp:mdpHash,
    });
    res.status(201).json(utilisateur);
};

exports.login = (req, res)=>{
    res.status(200).json({message:'Validation OK', data : req.body});
};
