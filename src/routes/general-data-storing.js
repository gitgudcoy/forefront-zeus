const { db } = require("../config");
const {
  MasterStore,
  MasterStoreCatalogue,
  MasterStoreChannels,
  MasterStoreDisplayItem,
  MasterStoreRoles,
} = require("forefront-polus/src/models/index")();
const { POSTRequest } = require("../utils/axios/post");
const { generateCode } = require("../utils/formater");
const {
  SequelizeErrorHandling,
  SequelizeRollback,
} = require("forefront-polus/src/utils/functions");
const { createMasterFile } = require("../utils/functions");
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
  STORE_PROFILE_PICTURE,
  POST_UPLOAD_FILES,
  UPLOAD_FILES,
  AUTHORIZATION,
  X_SID,
  CONTENT_TYPE,
  OWNER,
  STORE_OWNER,
} = require("../variables/general");
const {
  MASTER_STORE_CHANNELS_SEED,
} = require("forefront-polus/src/seeds/master_store_channels");
const {
  UNIDENTIFIED_ERROR,
  STORE_ALREADY_EXIST,
  INTERNAL_ERROR_CANT_COMMUNICATE,
  PRODUCT_DISPLAY_VALIDATION_MESSAGES,
} = require("../variables/responseMessage");
const {
  MasterStoreRolesAccesses,
} = require("forefront-polus/src/models/objects/master_stores_roles_accesses");
const {
  MasterStoreUserRoles,
} = require("forefront-polus/src/models/objects/master_stores_user_roles");
const {
  MasterAccess,
} = require("forefront-polus/src/models/user/master_access");
const { uuid } = require("uuidv4");
const multerInstance = require("multer")({
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const InitDataStoringRoute = (app) => {
  // POST Method
  // Route: /{version}/user/:id/stores/add
  // Content type: multipart/form-data
  // This route will store users new requested store, though it still need approval later
  // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
  app.post(
    `/v1/user/:id/stores/add`,
    checkAuth,
    multerInstance.single(UPLOADED_STORE_PROFILE_PICTURE),
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

        // create creative store channels
        const newChannels = Object.entries(
          MASTER_STORE_CHANNELS_SEED()
        ).map(([key, val], index) => {
          return {
            channelsOrder: index + 1,
            channelsJSON: { [key]: val },
            status: ACTIVE,
          };
        });

        // create store owner relationship
        const access = await MasterAccess.findOne({
          where: {
            accessName: STORE_OWNER,
            status: ACTIVE,
          },
        });

        const newRoleUUID = uuid();
        const newRole = {
          roleName: OWNER,
          status: ACTIVE,
          MasterStoreRolesAccesses: {
            storeRoleId: newRoleUUID,
            accessId: access.id,
            status: ACTIVE,
          },
          MasterStoreUserRoles: {
            storeRoleId: newRoleUUID,
            userId: req.user.userId,
            status: ACTIVE,
          },
        };

        // create the store payload
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
          MasterStoreRoles: newRole,
        };

        const store = await MasterStore.create(inserting, {
          transaction: trx,
          lock: true,
          include: [
            {
              model: MasterStoreChannels,
              as: "MasterStoreChannels",
            },
            {
              model: MasterStoreRoles,
              as: "MasterStoreRoles",
              include: [
                {
                  model: MasterStoreRolesAccesses,
                  as: "MasterStoreRolesAccesses",
                },
                {
                  model: MasterStoreUserRoles,
                  as: "MasterStoreUserRoles",
                },
              ],
            },
          ],
        });

        // if profile picture file doesn't exist, just commit
        if (!req.file) {
          // commit transaction
          await trx.commit();
          return res.status(200).send(store.id);
        }

        // uploaded store profile picture
        const uploadedStoreProfilePicture =
          createMasterFile(
            req.file,
            STORE_PROFILE_PICTURE,
            {
              storeId: store.id,
            }
          );

        const formData = new FormData();
        formData.append(
          "files",
          JSON.stringify([uploadedStoreProfilePicture])
        );

        // send a post request to the chronos API to store the file in its file system
        const result = await POSTRequest({
          endpoint: process.env.APP_CHRONOS_HOST_PORT,
          headers: {
            [AUTHORIZATION]: `Bearer ${
              req.headers[AUTHORIZATION] &&
              req.headers[AUTHORIZATION].split(" ")[1]
            }`,
            [X_SID]: req.headers[X_SID],
            [CONTENT_TYPE]: "multipart/form-data",
          },
          url: UPLOAD_FILES,
          data: formData,
          logTitle: POST_UPLOAD_FILES,
        });

        if (!result)
          return res.status(404).send(UNIDENTIFIED_ERROR);
        if (result.httpCode === 500)
          return res
            .status(500)
            .send(
              result.errContent
                ? result.errContent
                : INTERNAL_ERROR_CANT_COMMUNICATE
            );
        if (result.error)
          return res
            .status(result.httpCode)
            .send(result.errContent);

        // commit transaction
        await trx.commit();
        return res.status(200).send(store.id);
      } catch (error) {
        await SequelizeRollback(trx, error);
        SequelizeErrorHandling(error, res);
      }
    }
  );

  // POST Method
  // Route: /{version}/store/product/add?storeId={storeId}
  // This route will store users newly added product and catalogue, it doesn't need approval for now
  // TODO: create approval for later or approve it by DB first
  app.post(
    `/v1/store/product/add`,
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

      // uploaded image files
      let uploadedImageFiles =
        req.files[UPLOADED_IMAGE_FILES] || [];
      let uploadedAdditionalFiles =
        req.files[UPLOADED_ADDITIONAL_FILES] || [];

      if (uploadedImageFiles.length === 0)
        return res
          .status(400)
          .send(
            PRODUCT_DISPLAY_VALIDATION_MESSAGES.NO_PRODUCT_IMAGE_FOUND
          );

      // Get the request body
      const productInfo = req.body;
      const trx = await db.transaction();
      try {
        // find the store for the whole transaction identity
        const store = await MasterStore.findOne({
          where: {
            id: req.query.storeId,
          },
        });

        // creates list of catalogue that has been requested from the store owner in the client side
        // but will use the selected catalogue for the next step of creating display item
        const catalogues =
          await MasterStoreCatalogue.bulkCreate(
            JSON.parse(
              productInfo.newCatalogues
            ).result.map((obj) => {
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
            }),
            {
              ignoreDuplicates: true,
              transaction: trx,
              lock: true,
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
              productWeightUnit:
                productInfo.productWeightUnit,
              productPrice: productInfo.productPrice,
              productStocks: productInfo.productStocks,
              productSafetyStocks:
                productInfo.productSafetyStocks,
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
                  productInfo.productCatalogue
              ).id,
              uomId: JSON.parse(productInfo.productUOM).id,
            },
            { transaction: trx, lock: true }
          );

        // insert uploaded image
        uploadedImageFiles.forEach((obj, index, array) => {
          array[index] = createMasterFile(
            obj,
            PRODUCT_CATALOGUE_IMAGE,
            {
              displayItemId: displayItem.id,
            }
          );
        });

        // additional uploaded image files
        uploadedAdditionalFiles.forEach(
          (obj, index, array) => {
            array[index] = createMasterFile(
              obj,
              PRODUCT_CATALOGUE_ADDITIONAL_FILES,
              {
                displayItemId: displayItem.id,
              }
            );
          }
        );

        // concat between uploaded files and additional uploaded files
        const fileConcat = [
          ...uploadedImageFiles,
          ...uploadedAdditionalFiles,
        ];

        const formData = new FormData();
        formData.append(
          "files",
          JSON.stringify(fileConcat)
        );

        // send a post request to the chronos API to store the file in its file system
        const result = await POSTRequest({
          endpoint: process.env.APP_CHRONOS_HOST_PORT,
          headers: {
            [AUTHORIZATION]: `Bearer ${
              req.headers[AUTHORIZATION]?.split(" ")[1]
            }`,
            [X_SID]: req.headers[X_SID],
            [CONTENT_TYPE]: "multipart/form-data",
          },
          url: UPLOAD_FILES,
          data: formData,
          logTitle: POST_UPLOAD_FILES,
        });

        if (!result)
          return res.status(404).send(UNIDENTIFIED_ERROR);
        if (result.httpCode === 500)
          return res
            .status(500)
            .send(
              result.errContent
                ? result.errContent
                : INTERNAL_ERROR_CANT_COMMUNICATE
            );
        if (result.error)
          return res
            .status(result.httpCode)
            .send(result.errContent);

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
