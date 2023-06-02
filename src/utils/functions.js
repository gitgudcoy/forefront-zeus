const {
    SEQUELIZE_DATABASE_ERROR,
    SEQUELIZE_VALIDATION_ERROR,
    SEQUELIZE_UNIQUE_CONSTRAINT_ERROR
} = require('../variables/dbError');

function SequelizeErrorHandling(err, res) {
    // if the DB error is database error
    if (err.name === SEQUELIZE_DATABASE_ERROR) return res.send({
        code: err.parent.code,
        parentMessage: err.parent.sqlMessage,
        original: err.original.code,
        originalMessage: err.original.sqlMessage,
    }).status(500);
    // if the DB error is the user input error
    if (err.name === SEQUELIZE_VALIDATION_ERROR) {
        errMessages = [];
        err.errors.forEach((err) => errMessages.push(err.message));
        return res.send(errMessages).status(400);
    }
    // if the DB error is the unique constraint error
    if (err.name === SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
        errMessages = [];
        err.errors.forEach((err) => errMessages.push(err.message));
        return res.send({
            ...errMessages,
            possibility: USER_HAS_ALREADY_BEEN_CREATED
        }).status(400);
    }
}
module.exports = {
    SequelizeErrorHandling,
}


