const { MasterStore } =
  require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
} = require("forefront-polus/src/utils/functions");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { ACTIVE } = require("../variables/general");
const {
  MasterStoreRoles,
} = require("forefront-polus/src/models/objects/master_stores_roles");
const {
  MasterStoreUserRoles,
} = require("forefront-polus/src/models/objects/master_stores_user_roles");
const {
  MasterStoreRolesAccesses,
} = require("forefront-polus/src/models/objects/master_stores_roles_accesses");
const {
  MasterAccess,
} = require("forefront-polus/src/models/user/master_access");
const {
  CREATIVE_STORE_ACCESS,
  DASHBOARD_ACCESS,
} = require("forefront-polus/src/variables/general");
const { Op, where } = require("sequelize");
const { checkAuth } = require("../utils/middleware");

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/store/:id/roles
   * This route fetch store role info based on the store id
   */
  app.get(
    `/v1/store/:id/roles`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params.id)
        return res.status(500).send(UNIDENTIFIED_ERROR);

      // DB request option declaration
      const storeId = req.params.id;
      const userId = req.query.userId;
      const isWithAccesses = req.query.isWithAccesses;
      const isCreativeStore = req.query.isCreativeStore;
      const isDashboard = req.query.isDashboard;

      // fetch all role related to the store
      try {
        let whereOpt = {
          storeId: storeId,
          status: ACTIVE,
        };

        let includeOpt = [];

        if (!!userId) {
          let whereOpt2 = {
            userId: userId,
            status: ACTIVE,
          };

          includeOpt.push({
            model: MasterStoreUserRoles,
            as: "MasterStoreUserRoles",
            where: whereOpt2,
          });
        }

        includeOpt.push({
          model: MasterStoreRolesAccesses,
          as: "MasterStoreRolesAccesses",
          include: [
            {
              model: MasterAccess,
              as: "MasterAccess",
            },
          ],
        });

        // keep it outer join
        const options = {
          where: whereOpt,
          include: includeOpt,
        };

        const roles = await MasterStoreRoles.findAll(
          options
        );

        let response = {
          roles: roles,
        };

        if (!!isWithAccesses) {
          let whereOpt = {
            status: ACTIVE,
          };
          let opOr = [];

          if (!!isCreativeStore)
            opOr.push({
              accessType: CREATIVE_STORE_ACCESS,
            });

          if (!!isDashboard) {
            opOr.push({
              accessType: DASHBOARD_ACCESS,
            });
          }

          whereOpt = {
            ...whereOpt,
            [Op.or]: opOr,
          };

          response = {
            ...response,
            accesses: await MasterAccess.findAll({
              where: whereOpt,
            }),
          };
        }

        return res.send(response).status(200);
      } catch (error) {
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDistributorRoute,
};
