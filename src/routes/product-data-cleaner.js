const { MasterStoreDisplayItem } =
  require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const { checkAuth } = require("../utils/middleware");
const { db } = require("../config");
const {
  INTERNAL_ERROR_CANT_COMMUNICATE,
  UNIDENTIFIED_ERROR,
} = require("../variables/responseMessage");
const {
  AUTHORIZATION,
  X_SID,
  CONTENT_TYPE,
  DELETE_UPLOAD_UPDATE_FILES,
  PURGE_FILES,
} = require("../variables/general");
const { DELETERequest } = require("../utils/axios/delete");

const InitDataCleanerRoute = (app) => {
  /*PATCH Method
   * ROUTE: /{version}/store/product/delete
   * This route will delete the given product data from the database\
   * Based on the Id of the product
   */
  app.delete(
    `/v${process.env.APP_MAJOR_VERSION}/store/product/delete`,
    checkAuth,
    async (req, res) => {
      const productId = req.query.productId;
      const trx = await db.transaction();
      try {
        // Check if the product exists
        const product =
          await MasterStoreDisplayItem.findByPk(productId, {
            transaction: trx,
          });
        if (!product) throw new Error("Product not found");

        // Delete the product
        await product.destroy({ transaction: trx });

        // send a post request to the chronos API to store the file in its file system
        const deleteResult = await DELETERequest({
          endpoint: process.env.APP_CHRONOS_HOST_PORT,
          headers: {
            [AUTHORIZATION]: `Bearer ${
              req.headers[AUTHORIZATION]?.split(" ")[1]
            }`,
            [X_SID]: req.headers[X_SID],
            [CONTENT_TYPE]: "application/json",
          },
          url: PURGE_FILES,
          data: {
            displayItemIds: [productId],
          }, // This route used array format, cause it originally made to delete multiple files
          logTitle: DELETE_UPLOAD_UPDATE_FILES,
        });

        if (!deleteResult)
          throw new Error(UNIDENTIFIED_ERROR);
        if (deleteResult.httpCode === 500)
          throw new Error(
            deleteResult.errContent ||
              INTERNAL_ERROR_CANT_COMMUNICATE
          );
        if (deleteResult.error)
          throw new Error(deleteResult.errContent);

        // Commit the transaction
        await trx.commit();
        return res
          .status(200)
          .send("Product deleted successfully");
      } catch (error) {
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDataCleanerRoute,
};
