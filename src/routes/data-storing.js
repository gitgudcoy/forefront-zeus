const { MasterStore } = require("../models/objects/master_stores");
const { SequelizeRollback } = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const { UNIDENTIFIED_ERROR } = require("../variables/responseMessage");

const InitDataStoringRoute = (app) => {
    // POST Method
    // Route: /{version}/user/:id/stores/add
    // This route will store users new requested store, though it still need approval later
    // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
    app.post(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores/add`, checkAuth, async (req, res) => {
        // check query param availability
        if (!req.body) return res.status(400).send(UNIDENTIFIED_ERROR);
        // Get the request body
        const reqStore = req.body;
        const trx = await db.transaction();
        try {
            const existing = await MasterStore.findOne({
                where: {
                    storeName: reqStore.storeName
                },
                transaction: trx
            });

            var newStore = null;
            if (!existing) {
                newStore = await MasterStore.create({
                    storeName: reqStore.storeName,
                    storeDescription: reqStore.storeDescription,
                    storePhone: reqStore.storePhone,
                    storeWhatsapp: reqStore.storeWhatsapp,
                    storeEmail: reqStore.storeEmail,
                    storeCity: reqStore.storeCity,
                    storeSubdistrict: reqStore.storeSubdistrict,
                    storeWard: reqStore.storeWard,
                    storeAddress: reqStore.storeAddress,
                    storePostalCode: reqStore.storePostalCode,
                    userId: reqStore.userId
                }, { transaction: trx });

                await trx.commit();
            } else newStore = existing;
        } catch (error) {
            await SequelizeRollback(trx, error);
            SequelizeErrorHandling(error, res);
        }
    })

}

module.exports = {
    InitDataStoringRoute
}
