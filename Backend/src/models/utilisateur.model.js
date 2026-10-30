const pool = require('../config/db');

const COLONNES =
  'id, nom, prenom, email, role, equipe_id, statut, derniere_activite, date_creation';

const findAll = async () => {
  const [rows] = await pool.query(`SELECT ${COLONNES} FROM utilisateur ORDER BY id`);
  return rows;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM utilisateur WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT ${COLONNES} FROM utilisateur WHERE id = ?`,
    [id]
  );
  return rows[0];
};

const create = async ({
  nom,
  prenom = null,
  email,
  mdp,
  role = 'demandeur',
  equipe_id = null,
  statut = 'actif',
}) => {
  const [result] = await pool.query(
    `INSERT INTO utilisateur (nom, prenom, email, mdp, role, equipe_id, statut)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nom, prenom, email, mdp, role, equipe_id, statut]
  );
  return findById(result.insertId);
};

const update = async (id, { nom, prenom, email, role, equipe_id, statut }) => {
  await pool.query(
    `UPDATE utilisateur
     SET nom = ?, prenom = ?, email = ?, role = ?, equipe_id = ?, statut = ?
     WHERE id = ?`,
    [nom, prenom, email, role, equipe_id, statut, id]
  );
  return findById(id);
};

const updateDerniereActivite = async (id) => {
  await pool.query('UPDATE utilisateur SET derniere_activite = NOW() WHERE id = ?', [id]);
};

const remove = async (id) => {
  await pool.query('DELETE FROM utilisateur WHERE id = ?', [id]);
};
const changerMdp = async (id, mdpHash) => {
  await pool.query('UPDATE utilisateur SET mdp = ? WHERE id = ?', [mdpHash, id]);
};
module.exports = {
  findAll,
  findByEmail,
  findById,
  create,
  changerMdp,
  update,
  updateDerniereActivite,
  remove,
};