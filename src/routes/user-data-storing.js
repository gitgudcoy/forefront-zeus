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
const {
  MasterStoreMembers,
} = require("forefront-polus/src/models/objects/master_stores_members");
const {
  MasterStoreUserRoles,
} = require("forefront-polus/src/models/objects/master_stores_user_roles");

const InitDataStoringRoute = (app) => {
  // POST Method
  // Route: /{version}/user/:id/saved-address
  // This route will post the newly saved user address
  app.post(
    `/v1/user/:id/saved-address`,
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

  /*POST Method
   * ROUTE: /{version}/user/:id/memberships
   * This route post new user store memberships
   */
  app.post(
    `/v1/user/:id/store-memberships`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params.id)
        return res.status(500).send(UNIDENTIFIED_ERROR);

      const userId = req.params.id;
      // store id is if the client wants specific store membershipment check
      const storeId = req.query.storeId;

      // fetch all role related to the store
      const trx = await db.transaction();
      try {
        // check if the record is exist, if it exist there is no need to create one
        const existingRecord =
          await MasterStoreMembers.findOne({
            where: { userId: userId, storeId: storeId },
          });

        if (existingRecord)
          return res.status(200).send(existingRecord);

        const inserting = {
          storeId: storeId,
          userId: userId,
          status: ACTIVE,
        };
        const result = await MasterStoreMembers.create(
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

  /*POST Method
   * ROUTE: /{version}/user/:id/roles/assign
   * This route post new role to be assign to the user
   */
  app.post(
    `/v1/user/:id/roles/assign`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params.id)
        return res.status(500).send(UNIDENTIFIED_ERROR);

      const userId = req.params.id;
      const storeId = req.query.storeId;

      // fetch all role related to the store
      const trx = await db.transaction();
      try {
        const inserting = {
          storeId: storeId,
          userId: userId,
          status: ACTIVE,
        };
        const result = await MasterStoreUserRoles.create(
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
