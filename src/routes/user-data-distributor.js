const {
  SequelizeErrorHandling,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const { ACTIVE } = require("../variables/general");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { Op } = require("sequelize");
const {
  MasterFile,
} = require("forefront-polus/src/models/objects/master_file");
const {
  MasterStoreRoles,
} = require("forefront-polus/src/models/objects/master_stores_roles");
const {
  MasterStoreUserRoles,
} = require("forefront-polus/src/models/objects/master_stores_user_roles");
const {
  MasterAccess,
} = require("forefront-polus/src/models/user/master_access");
const {
  MasterStoreRolesAccesses,
} = require("forefront-polus/src/models/objects/master_stores_roles_accesses");
const { MasterUserBuyAddresses, MasterStore } =
  require("forefront-polus/src/models/index")();

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/user/:id/stores
   * This route fetch all the user stores datasets
   */
  app.get(
    `/v1/user/:id/stores`,
    checkAuth,
    async (req, res) => {
      // Get the request body
      const userId = req.params.id;
      const defaultResultOrder = "createdAt";
      const defaultResultOrderValue = "ASC";

      // use try catch for error handling
      try {
        const result = await MasterStore.findAll({
          where: {
            status: ACTIVE,
          },
          order: [
            [defaultResultOrder, defaultResultOrderValue],
          ],
          include: [
            {
              model: MasterFile,
              limit: 1,
              offset: 0,
            },
            {
              model: MasterStoreRoles,
              include: [
                {
                  model: MasterStoreUserRoles,
                  where: {
                    userId: userId,
                    status: ACTIVE,
                  },
                },
                {
                  model: MasterStoreRolesAccesses,
                  include: [MasterAccess, MasterStoreRoles],
                },
              ],
              required: true,
            },
          ],
        });
        return res.status(200).send(result);
      } catch (error) {
        SequelizeErrorHandling(error, res);
      }
    }
  );

  /*GET Method
   * ROUTE: /{version}/couriers
   * This route fetch all the saved address datasets by user id
   */
  app.get(
    `/v1/user/:id/saved-address`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      // Get the request body
      const userId = req.params.id;

      await MasterUserBuyAddresses.findAll({
        where: {
          userId: userId,
          status: ACTIVE,
        },
      })
        .then((result) => {
          return res.status(200).send(result);
        })
        .catch((error) => {
          SequelizeErrorHandling(error, res);
        });
    }
  );
};

module.exports = {
  InitDistributorRoute,
};
