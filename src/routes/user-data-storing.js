const { db } = require("../config");
const { MasterUserBuyAddresses } =
  require("forefront-polus/src/models/index")();
const { POSTRequest } = require("../utils/axios/post");
const { generateCode } = require("../utils/formater");
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const { validateStoreInfo } = require("../utils/validator");
const { ACTIVE } = require("../variables/general");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");

const InitDataStoringRoute = (app) => {
  // POST Method
  // Route: /{version}/user/:id/stores/add
  // This route will store users new requested store, though it still need approval later
  // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/user/:id/saved-address`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // Get the request body
      const userId = req.params.id;

      // Validate req body
      const validationResult = validateProductDisplayInfo(
        req.body
      );
      if (!validationResult.result)
        return res
          .status(400)
          .send(validationResult.message);

      // Get the request body
      const addressInfo = {
        ...req.body,
        userId: req.params.id,
      };

      // do the transaction
      const trx = await db.transaction();
      try {
        // create the store payload
        const inserting = {
          addressLabel: addressInfo.addressLabel,
          addressDetail: addressInfo.addressDetail,
          addressLatitude: addressInfo.addressLatitude,
          addressLongitude: addressInfo.addressLongitude,
          addressPhoneNumber:
            addressInfo.addressPhoneNumber,
          userId: addressInfo.userId,
          status: ACTIVE,
        };

        await MasterUserBuyAddresses.create(inserting, {
          transaction: trx,
          lock: true,
        });

        // commit transaction
        await trx.commit();
        return res.sendStatus(200);
      } catch (error) {
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDataStoringRoute,
};
