const {
  MasterStore,
  MasterCategory,
  MasterStoreChannels,
  MasterCourier,
  MasterFile,
  MasterUOM,
} = require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { ACTIVE } = require("../variables/general");

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/stores?id={storeId}
   * This route fetch store info based on its id
   * It can also call all store
   * TODO: give limit to the data requested
   */
  app.get(`/v1/stores`, async (req, res) => {
    // check query param availability
    if (!req.query)
      return res.status(500).send(UNIDENTIFIED_ERROR);

    // DB request option declaration
    const storeId = req.query.storeId;
    const isWithFiles = req.query.isWithFiles;

    // initialize where option
    let whereOpt = {
      status: ACTIVE,
    };

    if (storeId)
      whereOpt = {
        id: storeId,
        ...whereOpt,
      };

    // map all the option before execute the query
    const options = {
      where: whereOpt,
      include: [
        {
          model: MasterStoreChannels,
        },
      ],
    };

    if (isWithFiles) {
      options.include.push({
        model: MasterFile,
      });
    }

    // DB request execution
    await MasterStore.findAll(options)
      .then((result) => {
        // single data fetch
        if (storeId) result = result[0];
        if (storeId && !result) return res.sendStatus(404);

        // return if data available
        return res.status(200).send(result);
      })
      .catch((error) => {
        SequelizeErrorHandling(error, res);
      });
  });

  /*GET Method
   * ROUTE: /{version}/category
   * This route fetch all the selected app product category datasets
   */
  app.get(`/v1/category`, async (req, res) => {
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
  });

  /*GET Method
   * ROUTE: /{version}/uom
   * This route fetch all the selected app unit of measure datasets
   */
  app.get(`/v1/uom`, async (req, res) => {
    await MasterUOM.findAll({
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
  });

  /*GET Method
   * ROUTE: /{version}/couriers
   * This route fetch all the selected app product courier datasets
   */
  app.get(`/v1/couriers`, async (req, res) => {
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
  });
};

module.exports = {
  InitDistributorRoute,
};
