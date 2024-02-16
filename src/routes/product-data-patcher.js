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
  PATCH_UPLOAD_UPDATE_FILES,
  UPLOAD_UPDATE_FILES,
  REMOVED_IMAGE_FILES_DATA,
  REMOVED_ADDITIONAL_FILES_DATA,
} = require("../variables/general");
const { checkAuth } = require("../utils/middleware");
const { db } = require("../config");
const {
  validateProductDisplayInfo,
} = require("../utils/validator");
const { createMasterFile } = require("../utils/functions");
const { PATCHRequest } = require("../utils/axios/patch");
const multerInstance = require("multer")({
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const InitDataPatcherRoute = (app) => {
  /*PATCH Method
   * ROUTE: /{version}/store/product/update
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
      const updatingProduct =
        req.body.product && JSON.parse(req.body.product);
      const removedImageFilesData =
        req.body[REMOVED_IMAGE_FILES_DATA] &&
        JSON.parse(req.body[REMOVED_IMAGE_FILES_DATA]);
      const removedAdditionalFilesData =
        req.body[REMOVED_ADDITIONAL_FILES_DATA] &&
        JSON.parse(req.body[REMOVED_ADDITIONAL_FILES_DATA]);

      // uploaded image files
      let uploadedUpdateImageFiles =
        req.files[UPLOADED_UPDATE_IMAGE_FILES] || [];
      let uploadedUpdateAdditionalFiles =
        req.files[UPLOADED_UPDATE_ADDITIONAL_FILES] || [];

      // do the transaction
      const trx = await db.transaction();
      try {
        const validationResult =
          validateProductDisplayInfo(updatingProduct);

        if (!validationResult.result)
          throw new Error(
            `${validationResult.message}, pada produk ${updatingProduct.productName}`
          );

        await MasterStoreDisplayItem.update(
          {
            ...updatingProduct,
            availableCourierList:
              updatingProduct.courierChoosen,
            catalogueId: updatingProduct.productCatalogue,
            categoryId: updatingProduct.productCategory,
            uomId: updatingProduct.productUOM,
          },
          {
            where: {
              id: updatingProduct.id,
            },
            transaction: trx,
            lock: true,
          }
        );

        // insert uploaded image
        uploadedUpdateImageFiles.forEach(
          (obj, index, array) => {
            array[index] = createMasterFile(
              obj,
              PRODUCT_CATALOGUE_IMAGE,
              {
                displayItemId: updatingProduct.id,
              }
            );
          }
        );

        // additional uploaded image files
        uploadedUpdateAdditionalFiles.forEach(
          (obj, index, array) => {
            array[index] = createMasterFile(
              obj,
              PRODUCT_CATALOGUE_ADDITIONAL_FILES,
              {
                displayItemId: updatingProduct.id,
              }
            );
          }
        );

        // concat between uploaded files and additional uploaded files
        const fileConcats = [
          ...uploadedUpdateImageFiles,
          ...uploadedUpdateAdditionalFiles,
        ];
        const removedFileConcats = [
          ...removedImageFilesData,
          ...removedAdditionalFilesData,
        ];

        let removedFileIds = [];
        let removedFileDestinations = [];
        for (
          let index = 0;
          index < removedFileConcats.length;
          index++
        ) {
          removedFileIds[index] =
            removedFileConcats[index].id;
          removedFileDestinations[index] =
            removedFileConcats[index].destination;
        }

        const formData = new FormData();
        formData.append(
          "files",
          JSON.stringify(fileConcats)
        );
        formData.append(
          "removedFileIds",
          JSON.stringify(removedFileIds)
        );
        formData.append(
          "removedFileDestinations",
          JSON.stringify(removedFileDestinations)
        );

        // send a post request to the chronos API to store the file in its file system
        const uploadResult = await PATCHRequest({
          endpoint: process.env.APP_CHRONOS_HOST_PORT,
          headers: {
            [AUTHORIZATION]: `Bearer ${
              req.headers[AUTHORIZATION]?.split(" ")[1]
            }`,
            [X_SID]: req.headers[X_SID],
            [CONTENT_TYPE]: "multipart/form-data",
          },
          url: UPLOAD_UPDATE_FILES,
          data: formData,
          logTitle: PATCH_UPLOAD_UPDATE_FILES,
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
  InitDataPatcherRoute,
};
