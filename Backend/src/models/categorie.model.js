const pool = require('../config/db');

const findAll = async() =>{
    const [rows] = await pool.query('SELECT * FROM categorie ORDER BY nom');
    return rows;
};

const findById = async (id)=>{
    const [rows]=await pool.query('SELECT * FROM categorie WHERE id=?',[id]);
    return rows[0];
};

const create = async ({nom, description})=>{
    const [result]=await pool.query(
        'INSERT INTO categorie (nom,description) VALUES (?,?)',
        [nom,description ?? null]
    );
    return findById(result.insertId);
};

const update = async (id,{nom,description})=>{
    await pool.query(
        'UPDATE categorie SET nom=?, description=? WHERE id=?',
        [nom,description?? null,id]
    );
    return findById(id);
};

const remove = async(id)=>{
    await pool.query('DELETE FROM categorie WHERE id=?',[id]);
};

module.exports = {findAll,findById,create,update,remove};