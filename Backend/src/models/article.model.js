const pool = require('../config/db');

const COLONNES_LISTE = `
    a.id, a.titre, a.categorie_id, c.nom AS categorie_nom,
    a.auteur_id, u.nom AS auteur_nom, u.prenom AS auteur_prenom,
    a.statut, a.nb_vues, a.taux_utilite, a.date_creation, a.date_maj
`;

const JOINTURES = `
    FROM article a
    JOIN categorie c ON c.id = a.categorie_id
    JOIN utilisateur u ON u.id = a.auteur_id
`;

const findAll = async ({ publieOnly = false, categorieId } = {}) => {
    let sql = `SELECT ${COLONNES_LISTE} ${JOINTURES}`;
    const conditions = [];
    const params = [];

    if (publieOnly) {
        conditions.push("a.statut = 'publie'");
    }
    if (categorieId) {
        conditions.push('a.categorie_id = ?');
        params.push(categorieId);
    }
    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY a.date_maj DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(
        `SELECT ${COLONNES_LISTE}, a.contenu ${JOINTURES} WHERE a.id = ?`,
        [id]
    );
    return rows[0];
};

const create = async ({ titre, contenu, categorie_id, auteur_id, statut = 'brouillon' }) => {
    const [result] = await pool.query(
        `INSERT INTO article (titre, contenu, categorie_id, auteur_id, statut)
         VALUES (?, ?, ?, ?, ?)`,
        [titre, contenu, categorie_id, auteur_id, statut]
    );
    return findById(result.insertId);
};

const update = async (id, { titre, contenu, categorie_id, statut }) => {
    await pool.query(
        `UPDATE article
         SET titre = ?, contenu = ?, categorie_id = ?, statut = ?
         WHERE id = ?`,
        [titre, contenu, categorie_id, statut, id]
    );
    return findById(id);
};

const incrementerVues = async (id) => {
    await pool.query(
        'UPDATE article SET nb_vues = nb_vues + 1, date_maj = date_maj WHERE id = ?',
        [id]
    );
};

const remove = async (id) => {
    await pool.query('DELETE FROM article WHERE id = ?', [id]);
};

module.exports = { findAll, findById, create, update, incrementerVues, remove };