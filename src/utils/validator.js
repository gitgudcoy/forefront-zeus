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
  NO_EMPTY_6_CHAR_REGEX,
  NO_EMPTY_3_CHAR_REGEX,
  KODE_POS_REGEX,
  NO_ZERO_VALUE,
} = require("../variables/regex");
const {
  INVALID_PRODUCT_NAME,
  INVALID_PRODUCT_CATEGORY,
  INVALID_PRODUCT_CATALOG,
  INVALID_PRODUCT_DESCRIPTION,
  INVALID_PRODUCT_HASHTAG,
  INVALID_PRODUCT_CONDITION,
  INVALID_PRODUCT_WEIGHT,
  INVALID_PRODUCT_STOCKS,
  INVALID_PRODUCT_SAFETY_STOCKS,
  INVALID_COURIER_CHOOSEN,
  INVALID_STORE_NAME,
  INVALID_STORE_PHONE,
  INVALID_STORE_WHATSAPP,
  INVALID_STORE_EMAIL,
  INVALID_STORE_PROVINCE,
  INVALID_STORE_REGENCY,
  INVALID_STORE_DISTRICT,
  INVALID_STORE_VILLAGE,
  INVALID_STORE_ADDRESS,
  INVALID_STORE_POSTAL_CODE,
  INVALID_PRODUCT_PRICE,
  INVALID_PRODUCT_WEIGHT_UNIT,
} = require("../variables/responseMessage");

// STORE VALIDATION //
function validateStoreInfo(data) {
  // storeName
  var result = `${data.storeName}`.match(
    NO_EMPTY_3_CHAR_REGEX
  );
  if (!result)
    return { result: result, message: INVALID_STORE_NAME };

  // storePhone
  result = `${data.storePhone}`.match(PHONE_REGEX);
  if (!result)
    return { result: result, message: INVALID_STORE_PHONE };

  // storeWhatsapp
  result = `${data.storeWhatsapp}`.match(PHONE_REGEX);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_WHATSAPP,
    };

  // storeEmail
  result = `${data.storeEmail}`.match(EMAIL_REGEX);
  if (!result)
    return { result: result, message: INVALID_STORE_EMAIL };

  // storeProvince
  result = `${data.storeProvince}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_PROVINCE,
    };
  if (
    data.storeProvince.toUpperCase() ===
    PROVINCE_DEFAULT_VALUE
  )
    return {
      result: null,
      message: INVALID_STORE_PROVINCE,
    };

  // storeRegency
  result = `${data.storeRegency}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_REGENCY,
    };
  if (
    data.storeRegency.toUpperCase() ===
    REGENCY_DEFAULT_VALUE
  )
    return { result: null, message: INVALID_STORE_REGENCY };

  // storeDistrict
  result = `${data.storeDistrict}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_DISTRICT,
    };
  if (
    data.storeDistrict.toUpperCase() ===
    DISTRICT_DEFAULT_VALUE
  )
    return {
      result: null,
      message: INVALID_STORE_DISTRICT,
    };

  // storeVillage
  result = `${data.storeVillage}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_VILLAGE,
    };
  if (
    data.storeVillage.toUpperCase() ===
    VILLAGE_DEFAULT_VALUE
  )
    return { result: null, message: INVALID_STORE_VILLAGE };

  // storeAddress
  result = `${data.storeAddress}`.match(
    NO_EMPTY_6_CHAR_REGEX
  );
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_ADDRESS,
    };

  // storePostalCode
  result = `${data.storePostalCode}`.match(KODE_POS_REGEX);
  if (!result)
    return {
      result: result,
      message: INVALID_STORE_POSTAL_CODE,
    };
  return { result: result, message: EMPTY_STRING };
}

// PRODUCT CATALOG VALIDATION
function validateProductDisplayInfo(data) {
  // productName
  let result = `${data.productName}`.match(
    NO_EMPTY_3_CHAR_REGEX
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_NAME,
    };

  // productCategory
  result = `${data.productCategory}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_CATEGORY,
    };
  if (data.productCategory === "undefined")
    return {
      result: null,
      message: INVALID_PRODUCT_CATEGORY,
    };

  // productCatalog
  result = `${data.productCatalog}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_CATALOG,
    };
  if (data.productCatalog === "undefined")
    return {
      result: null,
      message: INVALID_PRODUCT_CATALOG,
    };

  // productDescription
  result = `${data.productDescription}`.match(
    NO_EMPTY_STRING
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_DESCRIPTION,
    };

  // productHashtag
  result = `${data.productHashtag}`.match(
    NO_EMPTY_3_CHAR_REGEX
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_HASHTAG,
    };

  // productCondition
  result = `${data.productCondition}`.match(
    NO_EMPTY_STRING
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_CONDITION,
    };

  // productWeight
  result = `${data.productWeight}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_WEIGHT,
    };
  if (data.productWeight <= 0)
    return {
      result: null,
      message: INVALID_PRODUCT_WEIGHT,
    };

  // productWeightUnit
  result = `${data.productWeightUnit}`.match(
    NO_EMPTY_STRING
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_WEIGHT_UNIT,
    };

  // productPrice
  result = `${data.productPrice}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_PRICE,
    };
  if (data.productPrice <= 0)
    return {
      result: null,
      message: INVALID_PRODUCT_PRICE,
    };

  // productStocks
  result = `${data.productStocks}`.match(NO_EMPTY_STRING);
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_STOCKS,
    };
  if (data.productStocks <= 0)
    return {
      result: null,
      message: INVALID_PRODUCT_STOCKS,
    };

  // productSafetyStocks
  result = `${data.productSafetyStocks}`.match(
    NO_EMPTY_STRING
  );
  if (!result)
    return {
      result: result,
      message: INVALID_PRODUCT_SAFETY_STOCKS,
    };
  if (data.productSafetyStocks <= 0)
    return {
      result: null,
      message: INVALID_PRODUCT_SAFETY_STOCKS,
    };

  // courierChoosen
  if (data.courierChoosen <= 0)
    return {
      result: null,
      message: INVALID_COURIER_CHOOSEN,
    };
  return { result: result, message: EMPTY_STRING };
}

module.exports = {
  validateStoreInfo,
  validateProductDisplayInfo,
};
