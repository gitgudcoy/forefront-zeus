const {
    PROVINCE_DEFAULT_VALUE,
    REGENCY_DEFAULT_VALUE,
    DISTRICT_DEFAULT_VALUE,
    VILLAGE_DEFAULT_VALUE,
    EMPTY_STRING
} = require("../variables/general");
const {
    EMAIL_REGEX,
    PHONE_REGEX,
    NO_EMPTY_STRING,
    NO_EMPTY_6_CHAR_REGEX,
    NO_EMPTY_3_CHAR_REGEX,
    KODE_POS_REGEX,
} = require("../variables/regex");
const {
    INVALID_PRODUCT_NAME,
    INVALID_PRODUCT_CATEGORY,
    INVALID_PRODUCT_CATALOG,
    INVALID_PRODUCT_DESCRIPTION,
    INVALID_PRODUCT_HASHTAG,
    INVALID_PRODUCT_CONDITION,
    INVALID_PRODUCT_WEIGHT,
    INVALID_PRODUCT_BID_PRICE,
    INVALID_PRODUCT_BIN_PRICE,
    INVALID_PRODUCT_BID_MULTIPLICATION,
    INVALID_PRODUCT_BID_MULTIPLICATION_PERIOD,
    INVALID_PRODUCT_BID_PERIOD, INVALID_PRODUCT_STOCKS,
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
    INVALID_STORE_POSTAL_CODE
} = require("../variables/responseMessage");

// STORE VALIDATION //
function validateStoreInfo(data) {
    var result = `${data.storeName}`.match(NO_EMPTY_3_CHAR_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_NAME };
    result = `${data.storePhone}`.match(PHONE_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_PHONE };
    result = `${data.storeWhatsapp}`.match(PHONE_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_WHATSAPP };
    result = `${data.storeEmail}`.match(EMAIL_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_EMAIL };
    result = `${data.storeProvince}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_STORE_PROVINCE };
    if (data.storeProvince.toUpperCase() === PROVINCE_DEFAULT_VALUE)
        return { result: null, message: INVALID_STORE_PROVINCE };
    result = `${data.storeRegency}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_STORE_REGENCY };
    if (data.storeRegency.toUpperCase() === REGENCY_DEFAULT_VALUE)
        return { result: null, message: INVALID_STORE_REGENCY };
    result = `${data.storeDistrict}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_STORE_DISTRICT };
    if (data.storeDistrict.toUpperCase() === DISTRICT_DEFAULT_VALUE)
        return { result: null, message: INVALID_STORE_DISTRICT };
    result = `${data.storeVillage}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_STORE_VILLAGE };
    if (data.storeVillage.toUpperCase() === VILLAGE_DEFAULT_VALUE)
        return { result: null, message: INVALID_STORE_VILLAGE };
    result = `${data.storeAddress}`.match(NO_EMPTY_6_CHAR_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_ADDRESS };
    result = `${data.storePostalCode}`.match(KODE_POS_REGEX);
    if (!result) return { result: result, message: INVALID_STORE_POSTAL_CODE };
    return { result: result, message: EMPTY_STRING };
}

// CATALOG VALIDATION
function validateProductDisplayInfo(data) {

    let result = `${data.productName}`.match(NO_EMPTY_3_CHAR_REGEX);
    if (!result) return { result: result, message: INVALID_PRODUCT_NAME };

    result = `${data.productCategory}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_CATEGORY };
    if (data.productCategory === "undefined") return { result: null, message: INVALID_PRODUCT_CATEGORY };

    result = `${data.productCatalog}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_CATALOG };
    if (data.productCatalog === "undefined") return { result: null, message: INVALID_PRODUCT_CATALOG };

    result = `${data.productDescription}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_DESCRIPTION };

    result = `${data.productHashtag}`.match(NO_EMPTY_3_CHAR_REGEX);
    if (!result) return { result: result, message: INVALID_PRODUCT_HASHTAG };

    result = `${data.productCondition}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_CONDITION };

    result = `${data.productWeight}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_WEIGHT };

    result = `${data.productBidPrice}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_BID_PRICE };

    result = `${data.productBINPrice}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_BIN_PRICE };

    result = `${data.productBidMultiplication}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_BID_MULTIPLICATION };

    result = `${data.productBidMultiplicationPeriod}`.match(NO_EMPTY_3_CHAR_REGEX);
    if (!result) return { result: result, message: INVALID_PRODUCT_BID_MULTIPLICATION_PERIOD };

    result = `${data.productBidPeriod}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_BID_PERIOD };

    result = `${data.productStocks}`.match(NO_EMPTY_STRING);
    if (!result) return { result: result, message: INVALID_PRODUCT_STOCKS };
    if (data.courierChoosen === 0) return { result: null, message: INVALID_COURIER_CHOOSEN };
    return { result: result, message: EMPTY_STRING };
}

module.exports = {
    validateStoreInfo,
    validateProductDisplayInfo
}
