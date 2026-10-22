const pool = require('../config/db');

const findByEmail = async (email)=>{
    const [rows] = await pool.query('SELECT * FROM utilisateur WHERE email = ?',[email]);
    return rows[0];
};

const findById = async (id)=>{
    const [rows] = await pool.query(
        'SELECT id, nom, prenom,role, equipe_id, statut, date_creation FROM utilisateur WHERE id=?',[id]
    );
    return rows[0];
};

const create = async ({nom, prenom, email, mdp, role ='demandeur'})=>{
    const [result] = await pool.query(
        'INSERT INTO utilisateur (nom, prenom,email,mdp,role) VALUES (?,?,?,?,?)',
        [nom, prenom,email,mdp,role]
    );
    return findById(result.insertId);
};
const updateDerniereActivite = async (id) => {
  await pool.query('UPDATE utilisateur SET derniere_activite = NOW() WHERE id = ?', [id]);
};

module.exports = {findByEmail,findById,create,updateDerniereActivite};