// Constants
exports.ADMIN = "ADMIN";
exports.USER = "USER";
exports.SUCCESS = "SUCCESS";
exports.STORE_PROFILE_PICTURE = "STORE_PROFILE_PICTURE";
exports.PRODUCT_CATALOGUE_IMAGE = "PRODUCT_CATALOGUE_IMAGE";
exports.PRODUCT_CATALOGUE_ADDITIONAL_FILES =
  "PRODUCT_CATALOGUE_ADDITIONAL_FILES";

// Store Roles
exports.EMPLOYEE = "EMPLOYEE";
exports.LEVEL_1 = "LEVEL_1";

// Multer Names
exports.UPLOADED_IMAGE_FILES = "uploadedImageFiles";
exports.UPLOADED_ADDITIONAL_FILES =
  "uploadedAdditionalFiles";
exports.UPLOADED_STORE_PROFILE_PICTURE =
  "uploadedStoreProfilePicture";

// Prefixes
exports.STR = "STR";
exports.PRD = "PRD";
exports.CLOG = "CLOG";

// Axios
exports.POST = "POST";
exports.GET = "GET";

// Axios Log Titles
exports.GET_CHECK_AUTH_TOKEN = "GET_CHECK_AUTH_TOKEN";
exports.POST_SEND_PROFILEPIC = "POST_SEND_PROFILEPIC";
exports.POST_ADD_CATALOGUE = "POST_ADD_CATALOGUE";
exports.POST_UPLOAD_FILES = "POST_UPLOAD_FILES";

// Headers
exports.X_SID = "x-sid";
exports.AUTHORIZATION = "authorization";
exports.CONTENT_TYPE = "Content-Type";

// Email Subject
exports.OTP_EMAIL =
  "Account Registration - Berikut adalah nomor OTPmu, jangan disebar ya !";

// API URLs
exports.CHECK_AUTH_TOKEN = `/v${process.env.APP_OLYMPUS_SERVICE_MAJOR_VERSION}/auth/check`;
exports.UPLOAD_FILES = `/v${process.env.APP_CHRONOS_MAJOR_VERSION}/files/upload`;

// Statuses
exports.ACTIVE = "ACTIVE";
exports.NON_ACTIVE = "NON_ACTIVE";
exports.DELETED = "DELETED";

// Default Values
exports.PROVINCE_DEFAULT_VALUE = "PILIH PROVINSI";
exports.REGENCY_DEFAULT_VALUE = "PILIH KOTA";
exports.DISTRICT_DEFAULT_VALUE = "PILIH KECAMATAN";
exports.VILLAGE_DEFAULT_VALUE = "PILIH KELURAHAN";

// Product Filters
exports.STORE_TYPE = "STORE_TYPE";
exports.CATEGORY = "CATEGORY";
exports.RATING = "RATING";
exports.STORE_LOCATION = "STORE_LOCATION";
exports.COURIER = "COURIER";

// Others
exports.EMPTY_STRING = "";
exports.ALPHABETH_CHAR_AND_NUMBER =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Filters
exports.FILTER_STORE_LEVEL = "FILTER_STORE_LEVEL";
exports.FILTER_PRICE_RANGE = "FILTER_PRICE_RANGE";
exports.FILTER_RATING = "FILTER_RATING";
exports.FILTER_STORE_LOCATION = "FILTER_STORE_LOCATION";
exports.FILTER_COURIER = "FILTER_COURIER";
