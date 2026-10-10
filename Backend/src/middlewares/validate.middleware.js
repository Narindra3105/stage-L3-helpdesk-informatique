const {validationResult} = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()){
        return next();
    }

    return res.status(400).json ({
        message : 'Données invalides',
        errors : errors.array().map((e) =>({
            champ : e.path,
            message : e.msg,
        })),
    });
};

module.exports = validate;