const pool=require('../config/db');

const findAll = async() =>{
    const [rows] = await pool.query('SELECT * FROM statut ORDER BY ordre');
    return rows;
};

const findById = async (id)=>{
    const [rows]=await pool.query('SELECT * FROM statut WHERE id=?',[id]);
    return rows[0];
};

const create = async ({nom, ordre,est_final})=>{
    const [result]=await pool.query(
        'INSERT INTO statut (nom,ordre,est_final) VALUES (?,?,?)',
        [nom,ordre,est_final ?? false]
    );
};

const update = async (id,{nom,ordre,est_final})=>{
    await pool.query(
        'UPDATE statut SET nom=?, ordre=?, est_final=? WHERE id=?',
        [nom,ordre,est_final ?? false,id]
    );
    return findById(id);
};

const remove = async(id)=>{
    await pool.query('DELETE FROM statut WHERE id=?',[id]);
};

module.exports = {findAll,findById,create,update,remove};