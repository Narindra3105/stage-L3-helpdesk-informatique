const crypto = require('crypto');
const pool = require('../config/db');

const SELECT_TICKET = `
    SELECT t.id, t.numero, t.sujet, t.description,
           t.demandeur_id, d.nom AS demandeur_nom, d.prenom AS demandeur_prenom,
           t.technicien_id, tc.nom AS technicien_nom,
           t.equipe_id, e.nom AS equipe_nom,
           t.priorite_id, p.nom AS priorite_nom, p.couleur AS priorite_couleur,
           t.categorie_id, cat.nom AS categorie_nom,
           t.statut_id, s.nom AS statut_nom, s.est_final,
           t.sla_id, t.date_creation, t.date_limite_reponse, t.date_limite_resolution,
           t.date_premiere_reponse, t.date_resolution, t.reouvert, t.nb_reouvertures
    FROM ticket t
    JOIN utilisateur d ON d.id = t.demandeur_id
    LEFT JOIN utilisateur tc ON tc.id = t.technicien_id
    JOIN equipe e ON e.id = t.equipe_id
    JOIN priorite p ON p.id = t.priorite_id
    LEFT JOIN categorie cat ON cat.id = t.categorie_id
    JOIN statut s ON s.id = t.statut_id
`;

const findAll = async ({ demandeurId } = {}) => {
    let sql = SELECT_TICKET;
    const params = [];

    if (demandeurId) {
        sql += ' WHERE t.demandeur_id = ?';
        params.push(demandeurId);
    }

    sql += ' ORDER BY t.date_creation DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`${SELECT_TICKET} WHERE t.id = ?`, [id]);
    return rows[0];
};

const create = async ({ sujet, description, demandeur_id, equipe_id, priorite_id, categorie_id }) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [statuts] = await conn.query('SELECT id FROM statut ORDER BY ordre ASC LIMIT 1');
        if (statuts.length === 0) {
            throw new Error('Aucun statut défini en base');
        }
        const statut = statuts[0];

        const [slaRows] = await conn.query(
            `SELECT id, delai_premiere_reponse_min, delai_resolution_min
             FROM sla
             WHERE priorite_id = ? AND (equipe_id = ? OR equipe_id IS NULL)
             ORDER BY equipe_id IS NULL
             LIMIT 1`,
            [priorite_id, equipe_id]
        );
        const sla = slaRows[0];

        const [result] = await conn.query(
            `INSERT INTO ticket
                (numero, sujet, description, demandeur_id, equipe_id, priorite_id, categorie_id,
                 statut_id, sla_id, date_limite_reponse, date_limite_resolution)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
                     DATE_ADD(NOW(), INTERVAL ? MINUTE),
                     DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
            [
                `TMP-${crypto.randomUUID().slice(0, 15)}`,
                sujet,
                description ?? null,
                demandeur_id,
                equipe_id,
                priorite_id,
                categorie_id,
                statut.id,
                sla ? sla.id : null,
                sla ? sla.delai_premiere_reponse_min : null,
                sla ? sla.delai_resolution_min : null,
            ]
        );

        await conn.query(
            `UPDATE ticket
             SET numero = CONCAT('TCK-', YEAR(NOW()), '-', LPAD(id, 5, '0'))
             WHERE id = ?`,
            [result.insertId]
        );

        await conn.commit();
        return findById(result.insertId);
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

const update = async (id, { sujet, description }) => {
    await pool.query(
        'UPDATE ticket SET sujet = ?, description = ? WHERE id = ?',
        [sujet, description, id]
    );
    return findById(id);
};

const remove = async (id) => {
    await pool.query('DELETE FROM ticket WHERE id = ?', [id]);
};

const assigner = async (id, technicienId) => {
    await pool.query(
        'UPDATE ticket SET technicien_id = ? WHERE id = ?',
        [technicienId, id]
    );
    return findById(id);
};
const changerStatut = async (id, statutId, effets = {}) => {
    const sets = ['statut_id = ?'];
    const params = [statutId];

    if (effets.resolution) {
        sets.push('date_resolution = NOW()');
    }
    if (effets.reouverture) {
        sets.push('date_resolution = NULL', 'reouvert = 1', 'nb_reouvertures = nb_reouvertures + 1');
    }
    if (effets.premiereReponse) {
        sets.push('date_premiere_reponse = COALESCE(date_premiere_reponse, NOW())');
    }

    params.push(id);
    await pool.query(`UPDATE ticket SET ${sets.join(', ')} WHERE id = ?`, params);
    return findById(id);
};
module.exports = { findAll, findById, create, assigner,changerStatut, update, remove };