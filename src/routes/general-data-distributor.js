const {
  MasterStore,
  MasterCategory,
  MasterStoreChannels,
  MasterCourier,
  MasterStoreEmployees,
} = require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  mapListWithSequelizeOPEQ,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { ACTIVE } = require("../variables/general");
const { Op } = require("sequelize");

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/stores?id={storeId}
   * This route fetch store info based on its id
   * It can also call all store
   * TODO: give limit to the data requested
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/stores`,
    async (req, res) => {
      // check query param availability
      if (!req.query)
        return res.status(500).send(UNIDENTIFIED_ERROR);

      // DB request option declaration
      const storeId = req.query.storeId;
      let options = {
        status: ACTIVE,
      };
      options = storeId
        ? {
            id: storeId,
            ...options,
          }
        : options;

      // DB request execution
      await MasterStore.findAll({
        where: options,
        include: MasterStoreChannels,
      })
        .then((result) => {
          // single data fetch
          if (storeId) result = result[0];
          if (storeId && !result)
            return res.sendStatus(404);

          // return if data available
          return res.status(200).send(result);
        })
        .catch((error) => {
          SequelizeErrorHandling(error, res);
        });
    }
  );

  /*GET Method
   * ROUTE: /{version}/user/:id/stores
   * This route fetch all the user stores datasets
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/user/:id/stores`,
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
   * ROUTE: /{version}/category
   * This route fetch all the selected app product category datasets
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/category`,
    checkAuth,
    async (req, res) => {
      await MasterCategory.findAll({
        where: {
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

  /*GET Method
   * ROUTE: /{version}/couriers
   * This route fetch all the selected app product courier datasets
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/couriers`,
    checkAuth,
    async (req, res) => {
      await MasterCourier.findAll({
        where: {
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
