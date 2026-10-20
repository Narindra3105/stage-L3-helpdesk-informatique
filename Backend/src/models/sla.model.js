const pool  = require('../config/db');

const findAll = async () =>{
    const [rows] = await pool.query('SELECT * FROM sla ORDER BY nom');
    return rows;
};

const findById = async (id) =>{
    const [rows] = await pool.query('SELECT * FROM sla WHERE id=?',[id]);
    return rows[0];
};

const findByPrioriteEquipe = async (priorite_id, equipe_id, excludeId = 0) => {
    const [rows] = await pool.query(
        'SELECT id FROM sla WHERE priorite_id = ? AND equipe_id <=> ? AND id <> ?',
        [priorite_id, equipe_id ?? null, excludeId]
    );
    return rows[0];
};

const create = async ({nom,priorite_id,equipe_id,delai_premiere_reponse_min,delai_resolution_min}) =>{
    const [result]= await pool.query(
        'INSERT INTO sla (nom,priorite_id,equipe_id,delai_premiere_reponse_min,delai_resolution_min) VALUES (?,?,?,?,?)',
        [nom,priorite_id,equipe_id ?? null,delai_premiere_reponse_min,delai_resolution_min ]
    );
    return findById(result.insertId);
};

const update = async (id,{nom,priorite_id,equipe_id,delai_premiere_reponse_min,delai_resolution_min}) =>{
    await pool.query(
        'UPDATE sla SET nom=?, priorite_id=?, equipe_id=?, delai_premiere_reponse_min=?, delai_resolution_min=? WHERE id=?',
        [nom,priorite_id,equipe_id ?? null,delai_premiere_reponse_min,delai_resolution_min ,id]
    );
    return findById(id);
};

const remove = async (id)=> {
    await pool.query('DELETE FROM sla WHERE id=?',[id]);
};

module.exports = {findAll,findById,create,update,remove,findByPrioriteEquipe};