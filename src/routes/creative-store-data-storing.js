const { db } = require("../config");
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const { ACTIVE } = require("../variables/general");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const {
  MasterStoreMembers,
} = require("forefront-polus/src/models/objects/master_stores_members");
const {
  MasterStoreRoles,
} = require("forefront-polus/src/models/objects/master_stores_roles");

const InitDataStoringRoute = (app) => {
  /*POST Method
   * ROUTE: /{version}/user/:id/memberships
   * This route post new user store memberships
   */
  app.post(
    `/v1/store/:id/roles/create`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params.id)
        return res.status(500).send(UNIDENTIFIED_ERROR);

      const storeId = req.params.id;

      // fetch all role related to the store
      const trx = await db.transaction();
      try {
        const inserting = {
          storeId: storeId,
          status: ACTIVE,
        };
        const result = await MasterStoreRoles.create(
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
