const { Op } = require("sequelize");
const { db } = require("../config");
const { MasterStore } = require("../models/objects/master_stores");
const { SequelizeErrorHandling } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const { UNIDENTIFIED_ERROR } = require("../variables/responseMessage");
const { MasterStoreCatalogue } = require("../models/objects/master_stores_catalogue");
const { MasterCategory } = require("../models/objects/master_category");
const { ACTIVE } = require("../variables/general");

const InitDataDistributorRoute = (app) => {

    /*GET Method
    * ROUTE: /{version}/user/:id/stores
    * This route fetch all the user stores datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);
        // Get the request body
        const userId = req.params.id
        await MasterStore.findAll({
            where: {
                userId: userId,
                status: ACTIVE
            },
        }).then((result) => {
            return res.status(200).send(result);
        }).catch((error) => {
            SequelizeErrorHandling(error, res);
        });
    });

    /*GET Method
    * ROUTE: /{version}/store/:id/catalogues
    * This route fetch all the selected store catalog datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/store/:id/catalogues`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);
        // Get the request body
        const storeId = req.params.id
        await MasterStoreCatalogue.findAll({
            where: {
                storeId: storeId,
                status: ACTIVE
            },
        }).then((result) => {
            return res.status(200).send(result);
        }).catch((error) => {
            SequelizeErrorHandling(error, res);
        });
    });

    /*GET Method
    * ROUTE: /{version}/category
    * This route fetch all the selected app product category datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/category`, checkAuth, async (req, res) => {
        await MasterCategory.findAll({
            where: {
                status: ACTIVE
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
