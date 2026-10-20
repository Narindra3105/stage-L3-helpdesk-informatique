const AppError = require('./AppError');

const handleDbError = (err, messages = {}) => {
    if (err.code === 'ER_DUP_ENTRY') {
        throw new AppError(messages.duplicate || 'Cette valeur existe déjà', 409);
    }
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new AppError(messages.referenced || 'Élément utilisé ailleurs, suppression impossible', 409);
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const missing = messages.missing || {};
        const fk = Object.keys(missing).find((name) => err.sqlMessage?.includes(name));
        throw new AppError(fk ? missing[fk] : 'Référence inexistante', 400);
    }
    throw err;
};

module.exports = handleDbError;