const jwt = require('jsonwebtoken');

const genererToken = (utilisateur)=>{
    const payload = {
        id:utilisateur.id,
        role:utilisateur.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPRESS_IN || 'id',
    });
};

const verifierToken = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {genererToken,verifierToken};