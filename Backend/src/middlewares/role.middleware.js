const roleMiddleware = (...rolesAutorises)=>{
    return (req,res,next)=>{
        if (!req.user){
            return res.status(401).json({message : 'Non authentifié'});
        }
        if (!rolesAutorises.includes(req.user.role)){
            return res.status(403).json({message:"Accès refusé : droits insuffisants"});
        }
        next();
    };
};

module.exports = roleMiddleware;