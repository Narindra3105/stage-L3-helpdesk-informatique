const AppError = require ('../utils/AppError');

const notFound = (req,res,next)=>{
    next (new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`,404));
}

const errorHandler = (err,req,res,next) =>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "Erreur interne du serveur";

    if (err.type === 'entinty.parse.failed'){
        statusCode = 400;
        message = 'JSON invalide dans le corps de la requête';
    }

    if (err.code === 'ER_DUP_ENTRY'){
        statusCode = 409;
        message = 'Cette valeur existe déjà (doublon)';
    }

    if(err.code ==='ER_NO_REFERENCED_ROW_2'){
        statusCode = 400;
        message = "Réference invalide : l'élément lié n'existe pas";
    }

    if(err.code === 'ER_ROW_IS_REFERENCED_2'){
        statusCode = 409;
        message = 'Suppression impossible : cet élément est utilisé ailleurs';
    }

    if (statusCode ===500){
        console.error(err);
        if(process.env.NODE_ENV === 'production'){
            message = 'Erreur interne du serveur';
        }
    }

    const reponse = {message};
    if (process.env.NODE_ENV !== 'production'){
        reponse.stack = err.stack;
    }

    res.status (statusCode).json(reponse);
};

module.exports = {notFound, errorHandler};