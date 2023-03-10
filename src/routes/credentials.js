var crypto = require('crypto');
const {
    validateUserPhoneNumber,
    validateEmail
} = require('../utils/formater')
const {
    SEND_MAIL,
    SEND_OTP,
    POST_SEND_EMAIL,
    OTP_EMAIL,
    POST_SEND_PROFILEPIC,
    PROFILE_PIC
} = require('../variables/general');
const {
    generateAccessToken,
    generateRefreshToken,
    SequelizeErrorHandling,
    generateOTP,
    renewToken,
} = require('../utils/functions');
const {upload} = require('../config/multer')
const { master_User } = require('../models/user/master_User');
const {
    WRONG_PASSWORD_INPUT,
    USER_NOT_FOUND,
    INVALID_EMAIL,
    INVALID_PHONE_NUMBER,
    UNIDENTIFIED_ERROR,
    OTP_UNMATCH,
    OTP_EXPIRED
} = require('../variables/responseMessage');

const {  POSTRequest } = require('../utils/axios/post');
const { checkCredentialTokenOTP, checkCredentialToken } = require('../utils/middleware');

const InitCredentialRoute = (app, passport) => {


    /*POST Method   
    * ROUTE: /{version}/auth/profilePic
    * This route is used to Change dp user with google drive api.
    */
    app.post(`/v${process.env.APP_MAJOR_VERSION}/auth/profilePic`, (req, res) => { //should add checktoken
        if (!req.body) return res.sendStatus(400);
        upload(req, res, (err) => {
            if(err) {res.status(400).send("Something went wrong!");}
        if (req.file.size >= 500000){return res.json({err : "file is to big"})}
        var buffer =  req.file.buffer
        var img = buffer.toString('base64');
        console.log(img)
        // post to chronos
        const result =  POSTRequest({
            endpoint: process.env.APP_PROFILEPIC_HOST_PORT,
            url: PROFILE_PIC,
            data: {
                mimetype : req.file.mimetype,
                imageFile: img,
                //username: req.user.username
            },
            logTitle: POST_SEND_PROFILEPIC
        });
        if (!result) return res.send(UNIDENTIFIED_ERROR).status(404);
        if (result.httpCode === 500) return res.sendStatus(500);
        if (result.error) return res.send(result.errContent).status(result.httpCode);
        return res.json({status : "succes",
                        fileItem : req.file}
                        )})
    });






    /*POST Method
    * ROUTE: /{version}/auth/token
    * This route refresh/renew the access token by generating a new one and replace it in the session.
    */
    app.post(`/v${process.env.APP_MAJOR_VERSION}/auth/token`, (req, res) => {
        // check query param availability
        if (!req.body) return res.sendStatus(400);
        if (!req.body.credentialToken) return res.sendStatus(401);
        const { result, err, status } = renewToken(req.body.credentialToken, req);
        if (status !== 200) return res.send(err).status(status);
        return res.json(result).status(status);
    });

    /*POST Method
    * ROUTE: /{version}/auth/verify/otp
    * This route is used to verify the OTP input by the user.
    */
    app.post(`/v${process.env.APP_MAJOR_VERSION}/auth/verify/otp`, checkCredentialTokenOTP, (req, res) => {
        // check query param availability
        if (!req.body) return res.sendStatus(400);
        if (!req.body.refreshToken) res.send(UNIDENTIFIED_ERROR).status(400);
        if (Date.now() >= req.user.OTPExpiration) return res.json({ err: OTP_EXPIRED }).status(403);
        if (req.body.OTPInput != req.user.OTP) return res.json({ resp: OTP_UNMATCH }).status(403);

        // If OTP valid, redirect to renew token
        const { result, err, status } = renewToken(req.body.refreshToken, req);
        if (status !== 200) return res.send(err).status(status);
        return res.json(result).status(status);
    });

    /*POST Method
    * ROUTE: /{version}/auth/login
    * This route authenticates the user by verifying a username and password.
    * After the username and password is verified, it will generate the access token and refresh token
    * The tokens can be use to manage the authentication flow of the user
    */
    app.post(`/v${process.env.APP_MAJOR_VERSION}/auth/login`, async (req, res) => {
        // check query param availability
        if (!req.body) return res.sendStatus(400);
        // Get the request body
        const reqUser = req.body;
        // Request find one to the database via sequelize function
        await master_User.findOne({ where: { username: reqUser.username } })
            .then((user) => {
                if (!user) return res.send(USER_NOT_FOUND).status(404);
                crypto.pbkdf2(reqUser.password, user.salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
                    if (err) res.send(err).status(500);
                    if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) return res.send(WRONG_PASSWORD_INPUT).status(403);
                    if (!req.session.refreshTokens) req.session.refreshTokens = [];

                    // put the necessary user info here
                    const userInfo = {
                        username: user.username,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        OTP: generateOTP().toString(),
                        OTPExpiration: Date.now() + (1000 * 60 * 10), //Expired in 10 min
                        OTPVerified: false
                    }

                    // send email OTP to user
                    const result = await POSTRequest({
                        endpoint: process.env.APP_MAILER_HOST_PORT,
                        url: SEND_MAIL,
                        data: {
                            receiver: user.email,
                            subject: OTP_EMAIL,
                            mailType: SEND_OTP,
                            props: userInfo
                        },
                        logTitle: POST_SEND_EMAIL
                    });

                    if (!result) return res.send(UNIDENTIFIED_ERROR).status(404);
                    if (result.httpCode === 500) return res.sendStatus(500);
                    if (result.error) return res.send(result.errContent).status(result.httpCode);

                    // token will only save the desired user info
                    const accessToken = generateAccessToken(userInfo);
                    const refreshToken = generateRefreshToken({
                        username: userInfo.username,
                        phoneNumber: userInfo.phoneNumber,
                        email: userInfo.email
                    });

                    req.session.refreshTokens.push(refreshToken);
                    res.json({
                        credentialToken: {
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    }).status(200);
                });
            }).catch((err) => {
                SequelizeErrorHandling(err, res);
            });
    });

    /*POST Method
    * ROUTE: /{version}/auth/google
    * This route authenticates the user by verifying user google account.
    *
    * An authentication form will be prompted in the client service, which
    * The strategy will proccess the data of the user's google account.
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/auth/google`,
        passport.authenticate('google', { scope: ['profile'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google'),
        function (req, res) {
            // check query param availability
            if (!req.query) return res.sendStatus(400);

            // Retrieve the tag from our URL path
            const query = req.query;
            // Successful authentication, redirect home.
            return res
                .send(
                    JSON.stringify({
                        user: query,
                    })
                )
                .status(200);
        });

    /* POST /{version}/auth/signup
    *
    * This route creates a new user account.
    *
    * A desired username and password are submitted to this route via the client service.
    * The password is hashed and then a new user record is inserted into the database. If the record is
    * successfully created, the user will be logged in.
    */
    app.post(`/v${process.env.APP_MAJOR_VERSION}/auth/signup`, async (req, res) => {
        // check query param availability
        if (!req.body) return res.sendStatus(400);
        

        // Validate req body
        if (!validateEmail(req.body.email)) res.send(INVALID_EMAIL);
        if (!validateUserPhoneNumber(req.body.phoneNumber)) res.send(INVALID_PHONE_NUMBER);

        // Generate the salt
        var salt = crypto.randomBytes(16);
        // Adding salt before encrypting the password
        // Hash the password with the SHA256 encryption function
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            if (err) return res.send(err).status(400);
            await master_User.findOrCreate({
                where: {
                    username: req.body.username,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email
                },
                defaults: {
                    username: req.body.username,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    hashedPassword: hashedPassword,
                    salt: salt
                }
            }).then(function ([newUser, createdUser]) {
                if (createdUser) return res.sendStatus(200);
            }).catch(function (err) {
                console.log(err);
                SequelizeErrorHandling(err, res);
            });
        });
    });

    /* POST /{version}/auth/logout
    *
    * This route will delete the refresh token from the session and log the user out.
    *
    */
    app.delete(`/v${process.env.APP_MAJOR_VERSION}/auth/logout`, (req, res) => {
        // check query param availability
        if (!req.body) return res.sendStatus(400);
        if (!req.session.refreshTokens) return res.sendStatus(403);

        refreshTokens = req.session.refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    })
}

module.exports = {
    InitCredentialRoute
}
