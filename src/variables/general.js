const POST_ADD_CATALOGUE = "POST_ADD_KATEGORI";
// GENERAL
const USER = "USER";
const SUCCESS = "SUCCESS";

// AXIOS
const POST = "POST";
const GET = "GET";

// AXIOS LOG TITLE
const POST_SEND_EMAIL = "POST_SEND_EMAIL";
const POST_SEND_PROFILEPIC = "POST_SEND_PROFILEPIC";

// EMAIL TYPE
const SEND_OTP = "SEND_OTP";

// EMAIL SUBJECT
const OTP_EMAIL = "Account Registration - Here is your OTP number";

// API URLs
const SEND_MAIL = `v${process.env.APP_MAILER_MAJOR_VERSION}/send`;
const PROFILE_PIC = `v${process.env.APP_PROFILEPIC_MAJOR_VERSION}/changeProfilPic`;
const ADDCATALOGUE = `v${process.env.APP_POSTKATEGORI_MAJOR_VERSION}/addcatalogue`

module.exports = {
    POST_ADD_CATALOGUE,
    ADDCATALOGUE,
    POST_SEND_PROFILEPIC,
    USER,
    SUCCESS,
    POST,
    GET,
    POST_SEND_EMAIL,
    SEND_OTP,
    SEND_MAIL,
    OTP_EMAIL,
    PROFILE_PIC
}