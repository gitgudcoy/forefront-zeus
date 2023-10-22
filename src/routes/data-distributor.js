const {
  MasterStore,
} = require("../models/objects/master_stores");
const {
  SequelizeErrorHandling,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const {
  MasterStoreCatalogue,
} = require("../models/objects/master_stores_catalogue");
const {
  MasterCategory,
} = require("../models/objects/master_category");
const { ACTIVE } = require("../variables/general");
const {
  MasterCourier,
} = require("../models/objects/master_courier");
const {
  MasterStoreChannels,
} = require("../models/objects/master_stores_channels");
const {
  MasterStoreEmployees,
} = require("../models/objects/master_stores_employees");
const { Op } = require("sequelize");
const {
  MasterStoreDisplayItem,
} = require("../models/objects/master_stores_display_item");
const {
  MasterFile,
} = require("../models/objects/master_file");
const { cloneDeep } = require("lodash");

const InitDataDistributorRoute = (app) => {
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
      options = storeId && {
        id: storeId,
        ...options,
      };

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

        const mappedStoreId = employeeStoreRelations.map(
          (value) => {
            return { id: value.storeId };
          }
        );

        const result = await MasterStore.findAll({
          where: {
            [Op.or]: mappedStoreId,
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
   * There are 2 different route for this endpoint
   * ROUTE: /{version}/store/catalogues
   * This route fetch all the selected store catalog datasets
   * ROUTE: /{version}/store/catalogues?storeId={storeId}&isWithProducts={bool}&isProductOnly={bool}&offset={number}&limit={number}&itemPage={number}&itemPerPage={number}
   * This route will fetch all the product if the toggle is given
   * storeId = the id for the reference store that has the catalogue
   * isWithProducts = toggle to query with the associated MasterStoreDisplayItem
   * isProductOnly = toggle to query with the associated MasterStoreDisplayItem and only returns it
   * offset = offset the query to MasterStoreCatalogue
   * limit = limit the query to MasterStoreCatalogue
   * itemPage = page of the object set from the fetched MasterStoreDisplayItems
   * itemPerPage = item per page of the object set from the fetched MasterStoreDisplayItems
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/store/catalogues`,
    checkAuth,
    async (req, res) => {
      // check query param availability
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // map all the query param
      const storeId = req.query.storeId || null;
      const isWithProducts =
        req.query.isWithProducts &&
        JSON.parse(req.query.isWithProducts);
      const isProductOnly =
        req.query.isProductOnly &&
        JSON.parse(req.query.isProductOnly);
      const offset =
        parseInt(req.query.offset, 10) || undefined;
      const limit =
        parseInt(req.query.limit, 10) || undefined;
      const itemPage =
        parseInt(req.query.itemPage, 10) || 0;
      const itemPerPage =
        parseInt(req.query.itemPerPage, 10) || null;

      // initialize where option
      let whereOpt = {
        status: ACTIVE,
      };

      whereOpt = storeId && {
        storeId: storeId,
        ...whereOpt,
      };

      // map all the option before execute the query
      const options = {
        where: whereOpt,
      };

      // map offset and limit if both parameter present
      options.limit = limit;
      options.offset = offset && offset * (limit || 0);

      // Optionally include the MasterStoreDisplayItem model based on the isWithProducts parameter
      if (isWithProducts)
        options.include = [
          {
            model: MasterStoreDisplayItem,
            include: [
              {
                model: MasterFile,
                limit: 1,
                offset: 0,
              },
            ],
          },
        ];

      // Get the request body
      await MasterStoreCatalogue.findAll(options)
        .then((result) => {
          // init arrays
          let resultArray = cloneDeep(result);
          let nextArray = [];
          // instructions
          let isNext = true;
          let isPrev = true;

          if (isWithProducts) {
            resultArray = result.reduce((acc, val) => {
              return acc.concat(
                val.MasterStoreDisplayItems
              );
            }, []);

            const tempArray = cloneDeep(resultArray);
            // Apply offset and limit to the concatenated books
            if (itemPerPage) {
              const offset = itemPage * (itemPerPage || 0);
              const nextOffset =
                (itemPage + 1) * (itemPerPage || 0);
              resultArray = tempArray.slice(
                offset,
                itemPerPage + offset
              );
              nextArray = tempArray.slice(
                nextOffset,
                itemPerPage + nextOffset
              );
            }

            if (itemPage === 0) isPrev = false;
            if (nextArray.length === 0) isNext = false;
          }

          // decide whether the response is
          // 1.Only Products
          // 2.Product and Catalogues
          // 3.Only Catalogues
          if (isWithProducts && isProductOnly)
            return res.status(200).send({
              result: resultArray, // the array
              instructions: {
                // intructions of what can be done and what can't
                isNext: isNext,
                isPrev: isPrev,
              },
            });
          else if (isWithProducts)
            return res.status(200).send({
              result: resultArray, // the array
              catalogues: result,
              instructions: {
                // intructions of what can be done and what can't
                isNext: isNext,
                isPrev: isPrev,
              },
            });
          else
            return res.status(200).send({
              result,
            });
        })
        .catch((error) => {
          SequelizeErrorHandling(error, res);
        });
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
  InitDataDistributorRoute,
};
