const { Op } = require("sequelize");
const { db } = require("../config");
const { MasterStore } = require("../models/objects/master_stores");
const { SequelizeErrorHandling } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const { UNIDENTIFIED_ERROR } = require("../variables/responseMessage");

const InitDataDistributorRoute = (app) => {
    /*GET Method
    * ROUTE: /{version}/user/:id/stores
    * This route fetch all the user stores datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.body) return res.status(400).send(UNIDENTIFIED_ERROR);
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);
        // Get the request body
        const reqStore = {
            ...req.body,
            userId: req.params.id
        };
        await MasterStore.findAll({
            where: {
                userId: reqStore.userId
            },
        }).then((result) => {
            return res.status(200).send(result);
        }).catch((error) => {
            SequelizeErrorHandling(error, res);
        });
    });
}

module.exports = {
    InitDataDistributorRoute
}
