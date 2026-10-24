const pool = require('../config/db');

const SELECT_COMMENTAIRE = `
    SELECT c.id, c.ticket_id, c.utilisateur_id,
           u.nom AS auteur_nom, u.prenom AS auteur_prenom, u.role AS auteur_role,
           c.contenu, c.type, c.date_creation
    FROM commentaire c
    JOIN utilisateur u ON u.id = c.utilisateur_id
`;

const findByTicket = async (ticketId, { publicOnly = false } = {}) => {
    let sql = `${SELECT_COMMENTAIRE} WHERE c.ticket_id = ?`;
    const params = [ticketId];

    if (publicOnly) {
        sql += " AND c.type = 'public'";
    }

    sql += ' ORDER BY c.date_creation ASC, c.id ASC';

    const [rows] = await pool.query(sql, params);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`${SELECT_COMMENTAIRE} WHERE c.id = ?`, [id]);
    return rows[0];
};

const create = async ({ ticket_id, utilisateur_id, contenu, type = 'public' }) => {
    const [result] = await pool.query(
        'INSERT INTO commentaire (ticket_id, utilisateur_id, contenu, type) VALUES (?, ?, ?, ?)',
        [ticket_id, utilisateur_id, contenu, type]
    );
    return findById(result.insertId);
};

const update = async (id, { contenu }) => {
    await pool.query('UPDATE commentaire SET contenu = ? WHERE id = ?', [contenu, id]);
    return findById(id);
};

const remove = async (id) => {
    await pool.query('DELETE FROM commentaire WHERE id = ?', [id]);
};

module.exports = { findByTicket, findById, create, update, remove };