const AppError = require('../utils/AppError');

exports.getTicket = async(req, res, next)=>{
    try{
        const ticket = null;

        if(!ticket){
            throw new AppError('Ticket introuvable',404);
        }
        res.json(ticket);
    }catch(err){
        next(err);
    }
};