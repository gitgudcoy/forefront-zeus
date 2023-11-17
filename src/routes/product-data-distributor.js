const {
  SequelizeErrorHandling,
  mapListWithSequelizeOPEQ,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const {
  MasterStoreCatalogue,
} = require("../models/objects/master_stores_catalogue");
const {
  MasterStoreDisplayItem,
} = require("../models/objects/master_stores_display_item");
const {
  MasterFile,
} = require("../models/objects/master_file");
const { cloneDeep } = require("lodash");
const { ACTIVE } = require("../variables/general");
const {
  MasterStore,
} = require("../models/objects/master_stores");
const {
  MasterCategory,
} = require("../models/objects/master_category");
const { Op } = require("sequelize");

const InitDistributorRoute = (app) => {
  /*GET Method
   * ROUTE: /{version}/store/catalogues/product-details
   * This route will fetch product details from the given product
   * This route requires no checkAuth function
   * This route need productId param cause it used findByPk function
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/store/catalogues/product-details`,
    async (req, res) => {
      // check query param availability
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // map all the query param
      const productId = req.query.productId || null;

      // initialize where option
      let whereOpt = {
        status: ACTIVE,
      };

      // map all the option before execute the query
      const options = {
        where: whereOpt,
      };

      // include every necessary relationship
      options.include = [
        {
          model: MasterFile,
          limit: 5,
          offset: 0,
        },
        {
          model: MasterCategory,
        },
        {
          model: MasterStoreCatalogue,
          include: [
            {
              model: MasterStore,
              include: [
                {
                  model: MasterFile,
                },
              ],
            },
          ],
        },
      ];

      // Get the request body
      await MasterStoreDisplayItem.findByPk(
        productId,
        options
      )
        .then((result) => {
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
   * There are 2 different route for this endpoint
   * ROUTE: /{version}/store/catalogues
   * This route fetch all the selected store catalog datasets
   * ROUTE: /{version}/store/catalogues?storeId={storeId}&isWithProducts={bool}&isProductOnly={bool}&offset={number}&limit={number}&itemPage={number}&itemPerPage={number}
   * This route will fetch all the product if the toggle is given
   * storeId = the id for the reference store that has the catalogue
   * isWithProducts = toggle to query with the associated MasterStoreDisplayItem
   * isProductOnly = toggle to query with the associated MasterStoreDisplayItem and only returns it (isWithProducts must TRUE)
   * offset = offset the query to MasterStoreCatalogue
   * limit = limit the query to MasterStoreCatalogue
   * itemPage = page of the object set from the fetched MasterStoreDisplayItems (isWithProducts must TRUE)
   * itemPerPage = item per page of the object set from the fetched MasterStoreDisplayItems (isWithProducts must TRUE)
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

      whereOpt = storeId
        ? {
            storeId: storeId,
            ...whereOpt,
          }
        : whereOpt;

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
   * ROUTE: /{version}/products
   * We use this route to get the requested products by the given ids
   */
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/products`,
    async (req, res) => {
      // check query param availability
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // get the options from the url param
      const isWithFiles =
        req.query.isWithFiles &&
        JSON.parse(req.query.isWithFiles);
      const listOfProductIds = req.query.productIds;
      const offset =
        parseInt(req.query.offset, 10) || undefined;
      const limit =
        parseInt(req.query.limit, 10) || undefined;

      // initialize where option
      let whereOpt = {
        status: ACTIVE,
      };

      // map all the listOfProductIds with sequelize Op.eq
      whereOpt = listOfProductIds
        ? {
            [Op.or]: mapListWithSequelizeOPEQ(
              listOfProductIds,
              "id",
              "id"
            ),
            ...whereOpt,
          }
        : whereOpt;

      // map all the option before execute the query
      const options = {
        where: whereOpt,
      };

      // map offset and limit if both parameter present
      options.limit = limit;
      options.offset = offset && offset * (limit || 0);

      // Optionally include the MasterFile model based on the isWithFiles parameter
      if (isWithFiles)
        options.include = [
          {
            model: MasterFile,
          },
        ];

      // Get the request body
      await MasterStoreDisplayItem.findAll(options)
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