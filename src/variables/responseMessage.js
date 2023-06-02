// GENERALS ERRORS
const UNIDENTIFIED_ERROR = "Something went wrong, please contact the support if you found this error !";

// INTERNAL ERRORS
const CANT_VALIDATE_RECOVERY_TOKEN = "Can't validate recovery token or the token might have been used. Please request the password recovery email again";
const INTERNAL_ERROR_CANT_COMMUNICATE = "INTERNAL ERROR: Can't communicate with the other services.";

// CREDENTIALS ERRORS
const PLEASE_VERIFY_OTP = "PLEASE_VERIFY_OTP";
const USER_UNAUTHORIZED = "User unauthorized";
const SESSION_TOKEN_NOT_FOUND = "Session token not found or might be expired";

module.exports = {
    CANT_VALIDATE_RECOVERY_TOKEN,
    INTERNAL_ERROR_CANT_COMMUNICATE,
    UNIDENTIFIED_ERROR,
    USER_UNAUTHORIZED,
    PLEASE_VERIFY_OTP,
    SESSION_TOKEN_NOT_FOUND
}