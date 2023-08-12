const { Op } = require("sequelize");
const { db } = require("../config");
const { MasterStore } = require("../models/objects/master_stores");
const { SequelizeErrorHandling } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const { UNIDENTIFIED_ERROR } = require("../variables/responseMessage");
const { MasterStoreCatalogue } = require("../models/objects/master_stores_catalogue");
const { MasterCategory } = require("../models/objects/master_category");
const { ACTIVE } = require("../variables/general");
const { MasterCourier } = require("../models/objects/master_courier");

const InitDataDistributorRoute = (app) => {

    /*GET Method
    * ROUTE: /{version}/store?id={id}
    * This route fetch store info based on its id
    * It can also call all store 
    * TODO: give limit to the data requested
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/stores`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.query) return res.status(400).send(UNIDENTIFIED_ERROR);

        // DB request option declaration
        const storeId = req.query.id;
        const defaultOptions = {
            status: ACTIVE
        }
        const options = storeId ? {
            id: storeId,
            ...defaultOptions
        } : defaultOptions;

        // DB request execution
        await MasterStore.findAll({
            where: options
        }).then((result) => {
            result = storeId ? result[0] : result;
            return res.status(200).send(result);
        }).catch((error) => {
            SequelizeErrorHandling(error, res);
        });
    });

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
    app.get(`/v${process.env.APP_MAJOR_VERSION}/store/catalogues`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);
        if (!req.query) return res.status(400).send(UNIDENTIFIED_ERROR);
        // Get the request body
        await MasterStore.findOne({
            include: MasterStoreCatalogue,
            where: {
                storeCode: req.query.code,
                status: ACTIVE
            },
        }).then((result) => {
            return res.status(200).send(result.MasterStoreCatalogues);
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

    /*GET Method
    * ROUTE: /{version}/couriers
    * This route fetch all the selected app product courier datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/couriers`, checkAuth, async (req, res) => {
        await MasterCourier.findAll({
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
