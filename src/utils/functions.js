const jwt = require('jsonwebtoken');
const {
    SEQUELIZE_DATABASE_ERROR,
    SEQUELIZE_VALIDATION_ERROR,
    SEQUELIZE_UNIQUE_CONSTRAINT_ERROR
} = require('../variables/dbError');
const { USER_HAS_ALREADY_BEEN_CREATED } = require('../variables/responseMessage');

function generateAccessToken(user) {
    return jwt.sign(JSON.stringify(user), process.env.APP_ACCESS_TOKEN_SECRET)
}

function generateRefreshToken(user) {
    return jwt.sign(JSON.stringify(user), process.env.APP_REFRESH_TOKEN_SECRET)
}

function renewToken(token, req) {
    var result = { result: null, err: null, status: null };
    const refreshToken = token;
    if (!req.session.refreshTokens.includes(refreshToken)) return result = { result: null, err: null, status: 403 };
    jwt.verify(refreshToken, process.env.APP_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return result = { result: null, err: err, status: 403 };
        // create renewed user
        const renewedUser = {
            username: user.username,
            phoneNumber: user.phoneNumber,
            email: user.email,
            OTPVerified: true
        }

        // generate new token
        const accessToken = generateAccessToken(renewedUser);
        return result = {
            result: {
                user: renewedUser,
                credentialToken: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            }, err: null, status: 200
        };
    })
    return result;
}

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

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}

module.exports = {
    generateOTP,
    generateAccessToken,
    renewToken,
    generateRefreshToken,
    SequelizeErrorHandling,

}


