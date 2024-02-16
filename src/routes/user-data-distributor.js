const {
  SequelizeErrorHandling,
  mapListWithSequelizeOPEQ,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const { ACTIVE } = require("../variables/general");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { Op } = require("sequelize");
const {
  MasterUserBuyAddresses,
  MasterStore,
  MasterStoreEmployees,
} = require("forefront-polus/src/models/index")();

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/user/:id/stores
   * This route fetch all the user stores datasets
   */
  app.get(
    `/v1/user/:id/stores`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      // Get the request body
      const userId = req.params.id;
      // use try catch for error handling
      try {
        const employeeStoreRelations =
          await MasterStoreEmployees.findAll({
            where: {
              userId: userId,
              status: ACTIVE,
            },
          });

        const result = await MasterStore.findAll({
          where: {
            [Op.or]: mapListWithSequelizeOPEQ(
              employeeStoreRelations,
              "id",
              "storeId"
            ),
            status: ACTIVE,
          },
          include: MasterStoreEmployees,
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
