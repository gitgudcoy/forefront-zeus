const {
  SequelizeErrorHandling,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const { ACTIVE } = require("../variables/general");
const {
  MasterCourier,
} = require("../models/objects/master_courier");

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/couriers
   * This route fetch all the saved address datasets by user id
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/user/saved-address`,
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
