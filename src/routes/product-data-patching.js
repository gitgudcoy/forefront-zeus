const {
  MasterStore,
  MasterCategory,
  MasterFile,
  MasterStoreDisplayItem,
  MasterStoreCatalogue,
} = require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const {
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const { cloneDeep } = require("lodash");
const {
  ACTIVE,
  UPLOADED_IMAGE_FILES,
  UPLOADED_ADDITIONAL_FILES,
} = require("../variables/general");
const { checkAuth } = require("../utils/middleware");
const { Sequelize } = require("sequelize");
const { db } = require("../config");
const {
  validateProductDisplayInfo,
} = require("../utils/validator");
const multerInstance = require("multer")({
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const InitDataPatchingRoute = (app) => {
  /*PATCH Method
   * ROUTE: /{version}/products
   * Content type: multipart/form-data
   * This route will bulkUpdate the given product datas based on the Id of the product
   */
  app.patch(
    `/v${process.env.APP_MAJOR_VERSION}/store/product/update`,
    checkAuth,
    multerInstance.fields([
      { name: UPLOADED_IMAGE_FILES, maxCount: 5 },
      { name: UPLOADED_ADDITIONAL_FILES, maxCount: 5 },
    ]),
    async (req, res) => {
      // check body availability
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      const productToUpdates =
        req.body.products && JSON.parse(req.body.products);

      // do the transaction
      const trx = await db.transaction();
      try {
        const results = await Promise.all(
          Object.keys(productToUpdates).map((id) => {
            const updatingProduct = productToUpdates[id];
            const validationResult =
              validateProductDisplayInfo(updatingProduct);

            if (!validationResult.result)
              throw new Error(
                `${validationResult.message}, pada produk ${updatingProduct.productName}`
              );

            return MasterStoreDisplayItem.update(
              {
                ...updatingProduct,
                availableCourierList:
                  updatingProduct.courierChoosen,
                catalogueId:
                  updatingProduct.productCatalogue,
                categoryId: updatingProduct.productCategory,
                uomId: updatingProduct.productUOM,
              },
              {
                where: {
                  id,
                },
              }
            );
          })
        );

        const updatedRowsCount = results.reduce(
          (sum, result) => sum + result,
          0
        );
        // commit transaction
        await trx.commit();
        return res
          .status(200)
          .send(
            `${updatedRowsCount} rows updated successfully.`
          );
      } catch (error) {
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDataPatchingRoute,
};
