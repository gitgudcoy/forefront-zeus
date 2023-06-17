const {
    EMAIL_REGEX,
    PHONE_REGEX,
    NO_EMPTY_STRING,
    NO_EMPTY_6_CHAR_REGEX,
    NO_EMPTY_3_CHAR_REGEX,
    KODE_POS_REGEX,
} = require("../variables/regex");

function validateStoreName(storeName) {
    const result = `${storeName}`.match(NO_EMPTY_3_CHAR_REGEX);
    return result;
}

function validateStorePhone(storePhone) {
    const result = `${storePhone}`.match(PHONE_REGEX);
    return result;
}

function validateStoreWhatsapp(storeWhatsapp) {
    const result = `${storeWhatsapp}`.match(PHONE_REGEX);
    return result;
}

function validateStoreEmail(storeEmail) {
    const result = `${storeEmail}`.match(EMAIL_REGEX);
    return result;
}

function validateStoreProvince(storeProvince) {
    const result = `${storeProvince}`.match(NO_EMPTY_STRING);
    return result;
}

function validateStoreRegency(storeRegency) {
    const result = `${storeRegency}`.match(NO_EMPTY_STRING);
    return result;
}

function validateStoreDistrict(storeDistrict) {
    const result = `${storeDistrict}`.match(NO_EMPTY_STRING);
    return result;
}

function validateStoreVillage(storeVillage) {
    const result = `${storeVillage}`.match(NO_EMPTY_STRING);
    return result;
}

function validateStoreAddress(storeAddress) {
    const result = `${storeAddress}`.match(NO_EMPTY_6_CHAR_REGEX);
    return result;
}

function validateStorePostalCode(storePostalCode) {
    const result = `${storePostalCode}`.match(KODE_POS_REGEX);
    return result;
}

module.exports = {
    validateStoreName,
    validateStorePhone,
    validateStoreWhatsapp,
    validateStoreEmail,
    validateStoreProvince,
    validateStoreRegency,
    validateStoreDistrict,
    validateStoreVillage,
    validateStoreAddress,
    validateStorePostalCode
}
