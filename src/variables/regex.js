const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/g;
const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/g;
const KODE_POS_REGEX = /^.{5,}$/g;
const NO_EMPTY_STRING = /^(?!\s*$)[\s\S]+/g;
const NO_ZERO_VALUE = /^0$/g;
const NO_EMPTY_X_CHAR_REGEX = (minimumChar) => {
  // Ensure minimumChar is a non-negative integer
  if (!Number.isInteger(minimumChar) || minimumChar < 0) {
    throw new Error("Invalid minimumChar value");
  }

  const pattern = `^(?!\\s*$)(?:(?!\\r\\n).){${minimumChar},}.*$`;
  return new RegExp(pattern);
};

module.exports = {
  NO_EMPTY_STRING,
  NO_ZERO_VALUE,
  KODE_POS_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  NO_EMPTY_X_CHAR_REGEX,
};
