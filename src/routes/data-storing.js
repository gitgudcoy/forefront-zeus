const { db } = require("../config");
const { MasterStore } = require("../models/objects/master_stores");
const { generateCode } = require("../utils/formater");
const { SequelizeRollback, SequelizeErrorHandling } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
    validateStoreName,
    validateStorePhone,
    validateStoreWhatsapp,
    validateStoreEmail,
    validateStoreProvince,
    validateStoreRegency,
    validateStoreDistrict,
    validateStoreVillage,
    validateStoreAddress,
    validateStorePostalCode
} = require("../utils/validator");
const { ACTIVE } = require("../variables/general");
const {
    UNIDENTIFIED_ERROR,
    STORE_ALREADY_EXIST,
    INVALID_STORE_NAME,
    INVALID_STORE_PHONE,
    INVALID_STORE_WHATSAPP,
    INVALID_STORE_EMAIL,
    INVALID_STORE_ADDRESS,
    INVALID_STORE_POSTAL_CODE,
    INVALID_STORE_PROVINCE,
    INVALID_STORE_REGENCY,
    INVALID_STORE_DISTRICT,
    INVALID_STORE_VILLAGE
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
        if (!validateStoreName(req.body.storeName)) return res.status(400).send(INVALID_STORE_NAME);
        if (!validateStorePhone(req.body.storePhone)) return res.status(400).send(INVALID_STORE_PHONE);
        if (!validateStoreWhatsapp(req.body.storeWhatsapp)) return res.status(400).send(INVALID_STORE_WHATSAPP);
        if (!validateStoreEmail(req.body.storeEmail)) return res.status(400).send(INVALID_STORE_EMAIL);
        if (!validateStoreProvince(req.body.storeProvince)) return res.status(400).send(INVALID_STORE_PROVINCE);
        if (!validateStoreRegency(req.body.storeRegency)) return res.status(400).send(INVALID_STORE_REGENCY);
        if (!validateStoreDistrict(req.body.storeDistrict)) return res.status(400).send(INVALID_STORE_DISTRICT);
        if (!validateStoreVillage(req.body.storeVillage)) return res.status(400).send(INVALID_STORE_VILLAGE);
        if (!validateStoreAddress(req.body.storeAddress)) return res.status(400).send(INVALID_STORE_ADDRESS);
        if (!validateStorePostalCode(req.body.storePostalCode)) return res.status(400).send(INVALID_STORE_POSTAL_CODE);

        // Get the request body
        const reqStore = {
            ...req.body,
            userId: req.params.id
        };
        const trx = await db.transaction();
        try {
            const existing = await MasterStore.findOne({
                where: {
                    storeName: reqStore.storeName
                },
                transaction: trx
            });

            const newStoreCode = generateCode(8, req.user);
            var newStore = null;
            if (!existing) {
                newStore = await MasterStore.create({
                    storeName: reqStore.storeName,
                    storeDescription: reqStore.storeDescription,
                    storeCode: newStoreCode,
                    storeLevel: 1,
                    storeQualityRating: 0,
                    storeSpeedRating: 0,
                    storeServiceRating: 0,
                    storePhone: reqStore.storePhone,
                    storeWhatsapp: reqStore.storeWhatsapp,
                    storeEmail: reqStore.storeEmail,
                    storeCity: reqStore.storeCity,
                    storeSubdistrict: reqStore.storeSubdistrict,
                    storeWard: reqStore.storeWard,
                    storeAddress: reqStore.storeAddress,
                    storePostalCode: reqStore.storePostalCode,
                    userId: reqStore.userId,
                    status: ACTIVE
                }, { transaction: trx });

                await trx.commit();
            } else return res.status(409).send(STORE_ALREADY_EXIST);

            return res.sendStatus(200);
        } catch (error) {
            await SequelizeRollback(trx, error);
            SequelizeErrorHandling(error, res);
        }
    })

}

module.exports = {
    InitDataStoringRoute
}
