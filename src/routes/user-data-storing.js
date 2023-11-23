const { db } = require("../config");
const { MasterUserBuyAddresses } =
  require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  validateBuyAddressesInfo,
} = require("../utils/validator");
const { ACTIVE } = require("../variables/general");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");

const InitDataStoringRoute = (app) => {
  // POST Method
  // Route: /{version}/user/:id/saved-address
  // This route will post the newly saved user address
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/user/:id/saved-address`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // Validate req body
      const validationResult = validateBuyAddressesInfo(
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
          addressCourierNote:
            addressInfo.addressCourierNote,
          addressPhoneNumber:
            addressInfo.addressPhoneNumber,
          addressLatitude: addressInfo.addressLatitude,
          addressLongitude: addressInfo.addressLongitude,
          userId: addressInfo.userId,
          status: ACTIVE,
        };

        const result = await MasterUserBuyAddresses.create(
          inserting,
          {
            transaction: trx,
            lock: true,
          }
        );

        // commit transaction
        await trx.commit();
        return res.status(200).send(result);
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
