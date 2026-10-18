const pool=require('../config/db');

const findAll = async() =>{
    const [rows] = await pool.query('SELECT * FROM priorite ORDER BY niveau_ordre');
    return rows;
};

const findById = async (id)=>{
    const [rows]=await pool.query('SELECT * FROM priorite WHERE id=?',[id]);
    return rows[0];
};

const create = async ({nom, niveau_ordre,couleur})=>{
    const [result]=await pool.query(
        'INSERT INTO priorite (nom,niveau_ordre,couleur) VALUES (?,?,?)',
        [nom,niveau_ordre,couleur ?? null]
    );
    return findById(result.insertId);
};

const update = async (id,{nom,niveau_ordre,couleur})=>{
    await pool.query(
        'UPDATE priorite SET nom=?, niveau_ordre=?, couleur=? WHERE id=?',
        [nom,niveau_ordre,couleur ?? null,id]
    );
    return findById(id);
};

const remove = async(id)=>{
    await pool.query('DELETE FROM priorite WHERE id=?',[id]);
};

module.exports = {findAll,findById,create,update,remove};