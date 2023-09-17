const {
  POSTRequest,
} = require("../../../forefront-olympus/src/utils/axios/post");
const { db } = require("../config");
const {
  MasterFile,
} = require("../models/objects/master_file");
const {
  MasterStore,
} = require("../models/objects/master_stores");
const {
  MasterStoreCatalogue,
} = require("../models/objects/master_stores_catalogue");
const {
  MasterStoreChannels,
} = require("../models/objects/master_stores_channels");
const {
  MasterStoreDisplayItem,
} = require("../models/objects/master_stores_display_item");
const { generateCode } = require("../utils/formater");
const {
  SequelizeRollback,
  SequelizeErrorHandling,
  createMasterFile,
} = require("../utils/functions");
const { checkAuth } = require("../utils/middleware");
const {
  validateStoreInfo,
  validateProductDisplayInfo,
} = require("../utils/validator");
const {
  ACTIVE,
  STR,
  PRD,
  CLOG,
  PRODUCT_CATALOGUE_IMAGE,
  PRODUCT_CATALOGUE_ADDITIONAL_FILES,
  UPLOADED_IMAGE_FILES,
  UPLOADED_ADDITIONAL_FILES,
  UPLOADED_STORE_PROFILE_PICTURE,
  PROFILE_PICTURE,
} = require("../variables/general");
const {
  initialStoreChannelsValue,
} = require("../variables/initialValues");
const {
  UNIDENTIFIED_ERROR,
  STORE_ALREADY_EXIST,
  INTERNAL_ERROR_CANT_COMMUNICATE,
} = require("../variables/responseMessage");
const multerInstance = require("multer")();

const InitDataStoringRoute = (app) => {
  // POST Method
  // Route: /{version}/user/:id/stores/add
  // This route will store users new requested store, though it still need approval later
  // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/user/:id/stores/add`,
    checkAuth,
    multerInstance.array(UPLOADED_STORE_PROFILE_PICTURE, 1),
    async (req, res) => {
      // check query param availability
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.params)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // Validate req body
      const validationResult = validateStoreInfo(req.body);
      if (!validationResult.result)
        return res
          .status(400)
          .send(validationResult.message);

      // Get the request body
      const storeInfo = {
        ...req.body,
        userId: req.params.id,
      };

      // do the transaction
      const trx = await db.transaction();
      try {
        // find existing store
        // if exist, return error 409 and tell the user that the store has been created before
        // if not exist, go to the next step
        const existing = await MasterStore.findOne({
          where: {
            storeName: storeInfo.storeName,
          },
        });

        if (existing)
          return res.status(409).send(STORE_ALREADY_EXIST);

        // generate new code and create the store with the provided data
        const newStoreCode = generateCode(8, req.user, STR);
        const newChannels = Object.entries(
          initialStoreChannelsValue()
        ).map(([key, val], index) => {
          return {
            channelsOrder: index + 1,
            channelsJSON: { [key]: val },
            status: ACTIVE,
          };
        });
        const inserting = {
          storeName: storeInfo.storeName,
          storeDescription: storeInfo.storeDescription,
          storeCode: newStoreCode,
          storeLevel: 1,
          storeQualityRating: 0,
          storeSpeedRating: 0,
          storeServiceRating: 0,
          storePhone: storeInfo.storePhone,
          storeWhatsapp: storeInfo.storeWhatsapp,
          storeEmail: storeInfo.storeEmail,
          storeProvince: storeInfo.storeProvince,
          storeRegency: storeInfo.storeRegency,
          storeDistrict: storeInfo.storeDistrict,
          storeVillage: storeInfo.storeVillage,
          storeAddress: storeInfo.storeAddress,
          storePostalCode: storeInfo.storePostalCode,
          userId: storeInfo.userId,
          status: ACTIVE,
          MasterStoreChannels: newChannels,
        };

        await MasterStore.create(inserting, {
          transaction: trx,
          include: [
            {
              model: MasterStoreChannels,
              as: "MasterStoreChannels",
            },
          ],
        });

        // uploaded store profile picture
        let uploadedStoreProfilePicture = req.files[
          UPLOADED_STORE_PROFILE_PICTURE
        ].map((obj) => {
          return createMasterFile(
            obj,
            PROFILE_PICTURE,
            `${obj.destination}/${obj.filename}`,
            {
              displayItemId: displayItem.id,
            }
          );
        });

        // TODO: store file in FS
        // send a post request to the chronos API to store the file in its file system
        const result = await POSTRequest({
          endpoint: process.env.APP_MAILER_HOST_PORT,
          url: SEND_MAIL,
          data: {
            receiver: user.email,
            subject: OTP_EMAIL,
            mailType: SEND_OTP,
            props: userInfo,
          },
          logTitle: POST_SEND_EMAIL,
        });

        if (!result)
          return res.status(404).send(UNIDENTIFIED_ERROR);
        if (result.httpCode === 500)
          return res
            .status(500)
            .send(INTERNAL_ERROR_CANT_COMMUNICATE);
        if (result.error)
          return res
            .status(result.httpCode)
            .send(result.errContent);

        // bulk create the files that has been concat
        await MasterFile.bulkCreate(
          uploadedStoreProfilePicture,
          { transaction: trx }
        );

        // commit transaction
        await trx.commit();
        return res.sendStatus(200);
      } catch (error) {
        // TODO: create retry function for an unknown sudden rollback
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );

  // POST Method
  // Route: /{version}/user/:id/stores/add
  // This route will store users newly added product and catalogue, it doesn't need approval for now
  app.post(
    `/v${process.env.APP_MAJOR_VERSION}/store/catalogues/add`,
    checkAuth,
    multerInstance.fields([
      { name: UPLOADED_IMAGE_FILES, maxCount: 5 },
      { name: UPLOADED_ADDITIONAL_FILES, maxCount: 5 },
    ]),
    async (req, res) => {
      // check query param availability
      if (!req.body)
        return res.status(400).send(UNIDENTIFIED_ERROR);
      if (!req.query)
        return res.status(400).send(UNIDENTIFIED_ERROR);

      // Validate req body
      const validationResult = validateProductDisplayInfo(
        req.body
      );
      if (!validationResult.result)
        return res
          .status(400)
          .send(validationResult.message);

      // Get the request body
      const productInfo = req.body;
      const trx = await db.transaction();
      try {
        // find the store for the whole transaction identity
        const store = await MasterStore.findOne({
          where: {
            storeCode: req.query.code,
          },
        });

        // creates list of catalogue that has been requested from the store owner in the client side
        // but will use the selected catalogue for the next step of creating display item
        const catalogues =
          await MasterStoreCatalogue.bulkCreate(
            JSON.parse(productInfo.newCatalogues).map(
              (obj) => {
                return {
                  id: obj.id,
                  catalogueName: obj.catalogueName,
                  catalogueCode: generateCode(
                    8,
                    req.user,
                    CLOG
                  ),
                  storeId: store.id,
                  status: ACTIVE,
                };
              }
            ),
            {
              ignoreDuplicates: true,
              transaction: trx,
            }
          );

        // create the display item based on the store and the selected catalogue
        const displayItem =
          await MasterStoreDisplayItem.create(
            {
              productName: productInfo.productName,
              productCode: generateCode(8, req.user, PRD),
              productDescription:
                productInfo.productDescription,
              productHashtag: productInfo.productHashtag,
              productCondition:
                productInfo.productCondition,
              productWeight: productInfo.productWeight,
              productBidPrice: productInfo.productBidPrice,
              productBINPrice: productInfo.productBINPrice,
              productBidMultiplication:
                productInfo.productBidMultiplication,
              productBidMultiplicationPeriod:
                productInfo.productBidMultiplicationPeriod,
              productBidPeriod:
                productInfo.productBidPeriod,
              productStocks: productInfo.productStocks,
              productRating: 0,
              availableCourierList:
                productInfo.courierChoosen,
              status: ACTIVE,
              categoryId: JSON.parse(
                productInfo.productCategory
              ).id,
              catalogueId: catalogues.find(
                (obj) =>
                  obj.catalogueName ===
                  productInfo.productCatalog
              ).id,
            },
            { transaction: trx }
          );

        // insert uploaded image
        // uploaded image files
        let uploadedImageFiles = req.files[
          UPLOADED_IMAGE_FILES
        ].map((obj) => {
          return createMasterFile(
            obj,
            PRODUCT_CATALOGUE_IMAGE,
            `${obj.destination}/${obj.filename}`,
            {
              displayItemId: displayItem.id,
            }
          );
        });

        // additional uploaded image files
        let uploadedAdditionalFiles = req.files[
          UPLOADED_ADDITIONAL_FILES
        ].map((obj) => {
          return createMasterFile(
            obj,
            PRODUCT_CATALOGUE_ADDITIONAL_FILES,
            `${obj.destination}/${obj.filename}`,
            {
              displayItemId: displayItem.id,
            }
          );
        });

        // concat between uploaded files and additional uploaded files
        const fileConcat = uploadedImageFiles.concat(
          uploadedAdditionalFiles
        );

        // TODO: store file in FS

        // bulk create the files that has been concat
        await MasterFile.bulkCreate(
          fileConcat.map((obj) => {
            return createMasterFile(
              obj,
              obj.fileType,
              obj.destination,
              {
                displayItemId: obj.displayItemId,
              }
            );
          }),
          { transaction: trx }
        );

        // commit all the transaction that has been made until now
        await trx.commit();
        return res.sendStatus(200);
      } catch (error) {
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );
};

module.exports = {
  InitDataStoringRoute,
};
