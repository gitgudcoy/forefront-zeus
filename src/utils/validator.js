const {
  PROVINCE_DEFAULT_VALUE,
  REGENCY_DEFAULT_VALUE,
  DISTRICT_DEFAULT_VALUE,
  VILLAGE_DEFAULT_VALUE,
  EMPTY_STRING,
} = require("../variables/general");

const {
  EMAIL_REGEX,
  PHONE_REGEX,
  NO_EMPTY_STRING,
  KODE_POS_REGEX,
  NO_EMPTY_X_CHAR_REGEX,
} = require("../variables/regex");

const {
  STORE_VALIDATION_MESSAGES,
  PRODUCT_DISPLAY_VALIDATION_MESSAGES,
  BUY_ADDRESSES_VALIDATION_MESSAGES,
} = require("../variables/responseMessage");

// STORE VALIDATION //
function validateField(data, regex, errorMessage) {
  const result = `${data}`.match(regex);
  return result ? null : { result, message: errorMessage };
}

function validateStoreInfo(data) {
  const validate = (field, regex, errorMessage) =>
    validateField(data[field], regex, errorMessage);

  return (
    validate(
      "storeName",
      NO_EMPTY_X_CHAR_REGEX(3),
      STORE_VALIDATION_MESSAGES.INVALID_STORE_NAME
    ) ||
    validate(
      "storePhone",
      PHONE_REGEX,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_PHONE
    ) ||
    validate(
      "storeWhatsapp",
      PHONE_REGEX,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_WHATSAPP
    ) ||
    validate(
      "storeEmail",
      EMAIL_REGEX,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_EMAIL
    ) ||
    validate(
      "storeProvince",
      NO_EMPTY_STRING,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_PROVINCE
    ) ||
    (data.storeProvince.toUpperCase() ===
      PROVINCE_DEFAULT_VALUE && {
      result: null,
      message:
        STORE_VALIDATION_MESSAGES.INVALID_STORE_PROVINCE,
    }) ||
    validate(
      "storeRegency",
      NO_EMPTY_STRING,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_REGENCY
    ) ||
    (data.storeRegency.toUpperCase() ===
      REGENCY_DEFAULT_VALUE && {
      result: null,
      message:
        STORE_VALIDATION_MESSAGES.INVALID_STORE_REGENCY,
    }) ||
    validate(
      "storeDistrict",
      NO_EMPTY_STRING,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_DISTRICT
    ) ||
    (data.storeDistrict.toUpperCase() ===
      DISTRICT_DEFAULT_VALUE && {
      result: null,
      message:
        STORE_VALIDATION_MESSAGES.INVALID_STORE_DISTRICT,
    }) ||
    validate(
      "storeVillage",
      NO_EMPTY_STRING,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_VILLAGE
    ) ||
    (data.storeVillage.toUpperCase() ===
      VILLAGE_DEFAULT_VALUE && {
      result: null,
      message:
        STORE_VALIDATION_MESSAGES.INVALID_STORE_VILLAGE,
    }) ||
    validate(
      "storeAddress",
      NO_EMPTY_X_CHAR_REGEX(6),
      STORE_VALIDATION_MESSAGES.INVALID_STORE_ADDRESS
    ) ||
    validate(
      "storePostalCode",
      KODE_POS_REGEX,
      STORE_VALIDATION_MESSAGES.INVALID_STORE_POSTAL_CODE
    ) || { result: true, message: EMPTY_STRING }
  );
}

// PRODUCT CATALOG VALIDATION
function validateProductDisplayInfo(data) {
  const validate = (field, regex, errorMessage) =>
    validateField(data[field], regex, errorMessage);

  return (
    validate(
      "productName",
      NO_EMPTY_X_CHAR_REGEX(3),
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_NAME
    ) ||
    validate(
      "productCategory",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_CATEGORY
    ) ||
    (data.productCategory === "undefined" && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_CATEGORY,
    }) ||
    validate(
      "productCatalog",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_CATALOG
    ) ||
    (data.productCatalog === "undefined" && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_CATALOG,
    }) ||
    validate(
      "productDescription",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_DESCRIPTION
    ) ||
    validate(
      "productHashtag",
      NO_EMPTY_X_CHAR_REGEX(3),
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_HASHTAG
    ) ||
    validate(
      "productCondition",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_CONDITION
    ) ||
    validate(
      "productWeight",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_WEIGHT
    ) ||
    (data.productWeight <= 0 && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_WEIGHT,
    }) ||
    validate(
      "productWeightUnit",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_WEIGHT_UNIT
    ) ||
    validate(
      "productPrice",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_PRICE
    ) ||
    (data.productPrice <= 0 && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_PRICE,
    }) ||
    validate(
      "productStocks",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_STOCKS
    ) ||
    (data.productStocks <= 0 && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_STOCKS,
    }) ||
    validate(
      "productSafetyStocks",
      NO_EMPTY_STRING,
      PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_SAFETY_STOCKS
    ) ||
    (data.productSafetyStocks <= 0 && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_PRODUCT_SAFETY_STOCKS,
    }) ||
    (data.courierChoosen <= 0 && {
      result: null,
      message:
        PRODUCT_DISPLAY_VALIDATION_MESSAGES.INVALID_COURIER_CHOOSEN,
    }) || { result: true, message: EMPTY_STRING }
  );
}

function validateBuyAddressesInfo(data) {
  const validate = (field, regex, errorMessage) =>
    validateField(data[field], regex, errorMessage);

  return (
    validate(
      "addressLabel",
      NO_EMPTY_X_CHAR_REGEX(3),
      BUY_ADDRESSES_VALIDATION_MESSAGES.INVALID_ADDRESS_LABEL
    ) ||
    validate(
      "addressDetail",
      NO_EMPTY_STRING,
      BUY_ADDRESSES_VALIDATION_MESSAGES.INVALID_ADDRESS_DETAIL
    ) ||
    validate(
      "addressPhoneNumber",
      NO_EMPTY_STRING,
      BUY_ADDRESSES_VALIDATION_MESSAGES.INVALID_ADDRESS_PHONENUMBER
    ) || { result: true, message: EMPTY_STRING }
  );
}

module.exports = {
  validateStoreInfo,
  validateProductDisplayInfo,
  validateBuyAddressesInfo,
};
