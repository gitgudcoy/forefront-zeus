const { db } = require("../config");
const { MasterStore } = require("../models/objects/master_stores");
const { generateCode } = require("../utils/formater");
const { SequelizeRollback, SequelizeErrorHandling } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
    validateStoreInfo,
    validateProductDisplayInfo
} = require("../utils/validator");
const { ACTIVE, STR, PRD } = require("../variables/general");
const {
    UNIDENTIFIED_ERROR,
    STORE_ALREADY_EXIST,
} = require("../variables/responseMessage");

const InitDataStoringRoute = (app) => {

    // POST Method
    // Route: /{version}/user/:id/stores/add
    // This route will store users new requested store, though it still need approval later
    // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
    app.post(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores/add`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.body) return res.status(400).send(UNIDENTIFIED_ERROR);
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);

        // Validate req body
        const validationResult = validateStoreInfo(req.body);
        if (!validationResult.result) return res.status(400).send(validationResult.message);

        // Get the request body
        const storeInfo = {
            ...req.body,
            userId: req.params.id
        };
        const trx = await db.transaction();
        try {
            const existing = await MasterStore.findOne({
                where: {
                    storeName: storeInfo.storeName
                },
                transaction: trx
            });

            const newStoreCode = generateCode(8, req.user, STR);
            var newStore = null;
            if (!existing) {
                newStore = await MasterStore.create({
                    storeName: storeInfo.storeName,
                    storeDescription: storeInfo.storeDescription,
                    storeCode: newStoreCode,
                    storeLevel: 1,
                    storeQualityRating: 0,
                    storeSpeedRating: 0,
                    storeServiceRating: 0,
                    storePhone: storeInfo.storePhone,
                    storeWhatsapp: storeInfo.storeWhatsapp,
                    storeEmail: storeInfo.storeEmail,
                    storeProvince: storeInfo.storeProvince,
                    storeRegency: storeInfo.storeRegency,
                    storeDistrict: storeInfo.storeDistrict,
                    storeVillage: storeInfo.storeVillage,
                    storeAddress: storeInfo.storeAddress,
                    storePostalCode: storeInfo.storePostalCode,
                    userId: storeInfo.userId,
                    status: ACTIVE
                }, { transaction: trx });

                await trx.commit();
            } else return res.status(409).send(STORE_ALREADY_EXIST);

            return res.sendStatus(200);
        } catch (error) {
            await SequelizeRollback(trx, error);
            SequelizeErrorHandling(error, res);
        }
    });

    // POST Method
    // Route: /{version}/user/:id/stores/add
    // This route will store users newly added product, it doesn't need approval for now
    app.post(`/v${process.env.APP_MAJOR_VERSION}/store/:id/product/add`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.body) return res.status(400).send(UNIDENTIFIED_ERROR);
        if (!req.params) return res.status(400).send(UNIDENTIFIED_ERROR);

        // Validate req body
        const validationResult = validateProductDisplayInfo(req.body)
        if (!validationResult.result) return res.status(400).send(validationResult.message);

        // Get the request body
        const productInfo = {
            ...req.body,
            storeId: req.params.code
        };
        const trx = await db.transaction();
        try {
            const newProductCode = generateCode(8, req.user, PRD);
            var newProduct = null;
            if (!existing) {
                newProduct = await MasterStore.create({
                    productName: productInfo.productName,
                    productCode: newProductCode,
                    productDescription: productInfo.storeDescription,
                    productCondition: productInfo.productCondition,
                    productWeight: productInfo.productWeight,
                    productRating: 0,
                    storeId: productInfo.userId,
                    status: ACTIVE
                }, { transaction: trx });

                await trx.commit();
            } else return res.status(409).send(STORE_ALREADY_EXIST);
            return res.sendStatus(200);
        } catch (error) {
            await SequelizeRollback(trx, error);
            SequelizeErrorHandling(error, res);
        }
    });
}

module.exports = {
    InitDataStoringRoute
}
