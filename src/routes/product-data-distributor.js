const {
  MasterStore,
  MasterCategory,
  MasterFile,
  MasterStoreDisplayItem,
  MasterStoreCatalogue,
} = require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  mapListWithSequelizeOPEQ,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { cloneDeep } = require("lodash");
const {
  ACTIVE,
  FILTER_RATING,
  FILTER_STORE_LEVEL,
  FILTER_COURIER,
  FILTER_STORE_LOCATION,
  FILTER_PRICE_RANGE,
} = require("../variables/general");
const { Op, Sequelize } = require("sequelize");

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
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // map all the query param
      const storeId = req.query.storeId || null;
      const isWithProducts = req.query.isWithProducts;
      const isProductOnly = req.query.isProductOnly;
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
                limit: 5,
                offset: 0,
                where: {
                  status: ACTIVE,
                },
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
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // Variables
      const defaultResultOrder = "createdAt";
      const defaultResultOrderValue = "DESC";
      let mapped = {
        [FILTER_STORE_LEVEL]: [],
        [FILTER_RATING]: [],
        [FILTER_STORE_LOCATION]: [],
        [FILTER_COURIER]: [],
        [FILTER_PRICE_RANGE]: null,
      };

      // get the options from the url param
      const sortKey =
        req.query.sortKey && JSON.parse(req.query.sortKey);
      const filters =
        req.query.filters && JSON.parse(req.query.filters);
      const keyword = req.query.keyword;
      const category = req.query.category;
      const listOfProductIds = req.query.productIds;
      const isWithFiles = req.query.isWithFiles;
      const isWithStoreInfo = req.query.isWithStoreInfo;
      const offset =
        parseInt(req.query.offset, 10) || undefined;
      const limit =
        parseInt(req.query.limit, 10) || undefined;

      // initialize where option
      let whereOpt = {
        status: ACTIVE,
      };
      let masterStoreWhereOpt = {
        status: ACTIVE,
      };

      // map all the listOfProductIds with sequelize Op.eq
      if (listOfProductIds)
        whereOpt = {
          [Op.or]: mapListWithSequelizeOPEQ(
            listOfProductIds,
            "id",
            "id"
          ),
          ...whereOpt,
        };

      if (keyword)
        whereOpt = {
          productName: {
            [Op.like]: `%${keyword}%`,
          },
          ...whereOpt,
        };

      for (let i = 0; i < filters?.length; i++) {
        if (!filters[i]?.value) continue;
        if (filters[i]?.filter === FILTER_RATING) {
          mapped[filters[i]?.filter].push({
            [Op.gte]: parseInt(filters[i]?.value),
          });
        } else if (
          filters[i]?.filter === FILTER_PRICE_RANGE &&
          (filters[i]?.value.min !== 0 ||
            filters[i]?.value.max !== 0)
        ) {
          mapped[filters[i]?.filter] = {
            [Op.between]: [
              parseInt(filters[i]?.value.min),
              parseInt(filters[i]?.value.max),
            ],
          };
        } else if (filters[i]?.filter === FILTER_COURIER) {
          mapped[filters[i]?.filter].push({
            [Op.like]:
              `%${filters[i]?.value}%`.toUpperCase(),
          });
        } else if (
          filters[i]?.filter === FILTER_STORE_LEVEL ||
          filters[i]?.filter === FILTER_STORE_LOCATION
        ) {
          mapped[filters[i]?.filter].push(
            filters[i]?.value
          );
        }
      }

      // map the filter array to each whereOptions
      if (mapped[FILTER_STORE_LEVEL].length > 0)
        masterStoreWhereOpt = {
          ...masterStoreWhereOpt,
          storeLevel: {
            [Op.or]: [...mapped[FILTER_STORE_LEVEL]],
          },
        };
      if (mapped[FILTER_PRICE_RANGE])
        whereOpt = {
          ...whereOpt,
          productPrice: mapped[FILTER_PRICE_RANGE],
        };
      if (mapped[FILTER_RATING].length > 0)
        whereOpt = {
          ...whereOpt,
          productRating: {
            [Op.or]: [...mapped[FILTER_RATING]],
          },
        };
      if (mapped[FILTER_COURIER].length > 0)
        whereOpt = {
          ...whereOpt,
          availableCourierList: {
            [Op.or]: [...mapped[FILTER_COURIER]],
          },
        };
      if (mapped[FILTER_STORE_LOCATION].length > 0)
        masterStoreWhereOpt = {
          ...masterStoreWhereOpt,
          storeProvince: {
            [Op.or]: [...mapped[FILTER_STORE_LOCATION]],
          },
        };

      console.log(sortKey);
      // map all the option before execute the query
      const options = {
        where: whereOpt,
        group: ["MasterStoreDisplayItem.id"],
        order: [
          [
            sortKey?.field || defaultResultOrder,
            sortKey?.value || defaultResultOrderValue,
          ],
        ],
      };

      // determine extra options
      if (isWithFiles || isWithStoreInfo)
        options.include = [];

      // Optionally include the desired related model based on the the parameters
      if (category)
        options.include.push({
          model: MasterCategory,
          where: {
            categoryName: category,
            status: ACTIVE,
          },
        });

      if (isWithFiles)
        options.include.push({
          model: MasterFile,
          where: {
            status: ACTIVE,
          },
        });

      if (isWithStoreInfo) {
        options.include.push({
          model: MasterStoreCatalogue,
          where: {
            status: ACTIVE,
          },
          include: [
            {
              model: MasterStore,
              where: masterStoreWhereOpt,
              include: [
                {
                  model: MasterFile,
                  where: {
                    status: ACTIVE,
                  },
                  required: false,
                },
              ],
            },
          ],
        });
      }

      const masterCountOption = {
        ...cloneDeep(options),
      };

      // map offset and limit if both parameter present
      if (limit) options.limit = limit;
      if (offset) options.offset = offset * (limit || 0);

      try {
        const result = await MasterStoreDisplayItem.findAll(
          options
        );
        const masterCount =
          await MasterStoreDisplayItem.findAll(
            masterCountOption
          );

        // assign values to the final response template
        let response = {
          result,
          masterCount: masterCount.length,
        };

        return res.status(200).send(response);
      } catch (error) {
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDistributorRoute,
};
