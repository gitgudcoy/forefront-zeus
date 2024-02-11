const { MasterStoreDisplayItem } =
  require("forefront-polus/src/models/index")();
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const {
  UNIDENTIFIED_ERROR,
  INTERNAL_ERROR_CANT_COMMUNICATE,
} = require("../variables/responseMessage");
const {
  UPLOADED_UPDATE_IMAGE_FILES,
  UPLOADED_UPDATE_ADDITIONAL_FILES,
  PRODUCT_CATALOGUE_IMAGE,
  PRODUCT_CATALOGUE_ADDITIONAL_FILES,
  AUTHORIZATION,
  X_SID,
  CONTENT_TYPE,
  POST_UPLOAD_UPDATE_FILES,
  UPLOAD_UPDATE_FILES,
} = require("../variables/general");
const { checkAuth } = require("../utils/middleware");
const { db } = require("../config");
const {
  validateProductDisplayInfo,
} = require("../utils/validator");
const { createMasterFile } = require("../utils/functions");
const { POSTRequest } = require("../utils/axios/post");
const {
  MasterFile,
} = require("forefront-polus/src/models/objects/master_file");
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
      { name: UPLOADED_UPDATE_IMAGE_FILES, maxCount: 5 },
      {
        name: UPLOADED_UPDATE_ADDITIONAL_FILES,
        maxCount: 5,
      },
    ]),
    async (req, res) => {
      // get the body
      const productToUpdates = req.body.products;
      // uploaded image files
      let uploadedUpdateImageFiles =
        req.body[UPLOADED_UPDATE_IMAGE_FILES] &&
        JSON.parse(req.body[UPLOADED_UPDATE_IMAGE_FILES]);
      let uploadedUpdateAdditionalFiles =
        req.body[UPLOADED_UPDATE_ADDITIONAL_FILES] &&
        JSON.parse(
          req.body[UPLOADED_UPDATE_ADDITIONAL_FILES]
        );

      // do the transaction
      const trx = await db.transaction();
      try {
        await Promise.all(
          Object.keys(productToUpdates).map(async (id) => {
            const updatingProduct = productToUpdates[id];
            const validationResult =
              validateProductDisplayInfo(updatingProduct);

            if (!validationResult.result)
              throw new Error(
                `${validationResult.message}, pada produk ${updatingProduct.productName}`
              );

            let uploadedImageFiles =
              uploadedUpdateImageFiles?.[id] || [];
            let uploadedAdditionalFiles =
              uploadedUpdateAdditionalFiles?.[id] || [];

            try {
              const results =
                await MasterStoreDisplayItem.update(
                  {
                    ...updatingProduct,
                    availableCourierList:
                      updatingProduct.courierChoosen,
                    catalogueId:
                      updatingProduct.productCatalogue,
                    categoryId:
                      updatingProduct.productCategory,
                    uomId: updatingProduct.productUOM,
                  },
                  {
                    where: {
                      id,
                    },
                    transaction: trx,
                    lock: true,
                  }
                );

              const oldFiles = await MasterFile.findAll({
                where: {
                  displayItemId: id,
                },
              });

              // insert uploaded image
              uploadedImageFiles = uploadedImageFiles.map(
                (obj) =>
                  createMasterFile(
                    obj,
                    PRODUCT_CATALOGUE_IMAGE,
                    {
                      displayItemId: results.id,
                    }
                  )
              );

              // additional uploaded image files
              uploadedAdditionalFiles =
                uploadedAdditionalFiles.map((obj) =>
                  createMasterFile(
                    obj,
                    PRODUCT_CATALOGUE_ADDITIONAL_FILES,
                    {
                      displayItemId: results.id,
                    }
                  )
                );

              // concat between uploaded files and additional uploaded files
              const fileConcat = uploadedImageFiles.concat(
                uploadedAdditionalFiles
              );

              const formData = new FormData();
              formData.append(
                "files",
                JSON.stringify(fileConcat)
              );
              formData.append(
                "oldFiles",
                JSON.stringify(oldFiles)
              );

              // send a post request to the chronos API to store the file in its file system
              const uploadResult = await POSTRequest({
                endpoint: process.env.APP_CHRONOS_HOST_PORT,
                headers: {
                  [AUTHORIZATION]: `Bearer ${
                    req.headers[AUTHORIZATION]?.split(
                      " "
                    )[1]
                  }`,
                  [X_SID]: req.headers[X_SID],
                  [CONTENT_TYPE]: "multipart/form-data",
                },
                url: UPLOAD_UPDATE_FILES,
                data: formData,
                logTitle: POST_UPLOAD_UPDATE_FILES,
              });

              if (!uploadResult)
                throw new Error(UNIDENTIFIED_ERROR);
              if (uploadResult.httpCode === 500)
                throw new Error(
                  uploadResult.errContent ||
                    INTERNAL_ERROR_CANT_COMMUNICATE
                );
              if (uploadResult.error)
                throw new Error(uploadResult.errContent);

              return results;
            } catch (error) {
              throw error;
            }
          })
        );

        // commit transaction
        await trx.commit();
        return res
          .status(200)
          .send(`rows updated successfully.`);
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
