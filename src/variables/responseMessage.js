// GENERALS ERRORS
const UNIDENTIFIED_ERROR = "Ada yang salah ni kawan, coba kontak customer service ya biar kamu dibantuin !";
const STORE_ALREADY_EXIST = "Toko sudah ada, coba pakai nama lain untuk toko baru anda !";

// INTERNAL ERRORS
const CANT_VALIDATE_RECOVERY_TOKEN = "Recovery token tidak dapat tervalidasi, token mungkin sudah pernah digunakan. \n\n Silahkan request email recovery password lagi ya.";
const INTERNAL_ERROR_CANT_COMMUNICATE = "INTERNAL ERROR: Can't communicate with the other services.";
const KEY_HAS_TO_BE_UNIQUE = "KEY_HAS_TO_BE_UNIQUE";

// CREDENTIALS ERRORS
const PLEASE_VERIFY_OTP = "PLEASE_VERIFY_OTP";
const USER_UNAUTHORIZED = "User unauthorized";
const SESSION_TOKEN_NOT_FOUND = "Session token tidak dapat ditemukan !";

// STORE VALIDATIONS
const INVALID_STORE_NAME = "Mohon input nama toko dengan benar \n\n 1. Nama toko minimal terdiri dari 3 karakter alfabet";
const INVALID_STORE_PHONE = "Mohon input nomor telepon toko dengan benar";
const INVALID_STORE_WHATSAPP = "Mohon input nomor whatsapp toko dengan benar";
const INVALID_STORE_EMAIL = "Mohon input alamat email toko dengan benar";
const INVALID_STORE_ADDRESS = "Mohon input alamat toko dengan benar";
const INVALID_STORE_PROVINCE = "Mohon input provinsi dengan benar";
const INVALID_STORE_REGENCY = "Mohon input kota dengan benar";
const INVALID_STORE_DISTRICT = "Mohon input kecamatan dengan benar";
const INVALID_STORE_VILLAGE = "Mohon input kelurahan dengan benar";
const INVALID_STORE_POSTAL_CODE = "Mohon input kode pos dengan benar";

// PRODUCT DISPLAY VALIDATIONS
const INVALID_PRODUCT_NAME = "Mohon input nama produk dengan benar \n\n 1. Nama produk minimal terdiri dari 3 karakter alfabet";
const INVALID_PRODUCT_CATEGORY = "Mohon input kategori produk dengan benar";
const INVALID_PRODUCT_CATALOG = "Mohon input nama katalog dengan benar";
const INVALID_PRODUCT_DESCRIPTION = "Mohon input deskripsi produk dengan benar";
const INVALID_PRODUCT_HASHTAG = "Mohon input hashtag produk dengan benar";
const INVALID_PRODUCT_CONDITION = "Mohon input kondisi produk dengan benar";
const INVALID_PRODUCT_WEIGHT = "Mohon input berat produk benar";
const INVALID_PRODUCT_BID_PRICE = "Mohon input harga lelang dengan benar";
const INVALID_PRODUCT_BIN_PRICE = "Mohon input harga buy it now dengan benar";
const INVALID_PRODUCT_BID_MULTIPLICATION = "Mohon harga kelipatan lelang dengan benar";
const INVALID_PRODUCT_BID_MULTIPLICATION_PERIOD = "Mohon input periode kelipatan lelang dengan benar";
const INVALID_PRODUCT_BID_PERIOD = "Mohon input periode lelang dengan benar";
const INVALID_PRODUCT_STOCKS = "Mohon input jumlah stok dengan benar";
const INVALID_COURIER_CHOOSEN = "Mohon input kurir yang dapat digunakan untuk penjemputan dengan benar";

module.exports = {
    STORE_ALREADY_EXIST,
    CANT_VALIDATE_RECOVERY_TOKEN,
    INTERNAL_ERROR_CANT_COMMUNICATE,
    KEY_HAS_TO_BE_UNIQUE,
    UNIDENTIFIED_ERROR,
    USER_UNAUTHORIZED,
    PLEASE_VERIFY_OTP,
    SESSION_TOKEN_NOT_FOUND,
    INVALID_STORE_NAME,
    INVALID_STORE_PHONE,
    INVALID_STORE_WHATSAPP,
    INVALID_STORE_EMAIL,
    INVALID_STORE_ADDRESS,
    INVALID_STORE_PROVINCE,
    INVALID_STORE_REGENCY,
    INVALID_STORE_DISTRICT,
    INVALID_STORE_VILLAGE,
    INVALID_STORE_POSTAL_CODE,
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
    INVALID_PRODUCT_BID_PERIOD,
    INVALID_PRODUCT_STOCKS,
    INVALID_COURIER_CHOOSEN,
}