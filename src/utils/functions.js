const { ACTIVE } = require("../variables/general");

function createMasterFile(file, fileType, ids) {
  return {
    filename: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    buffer: file.buffer,
    size: file.size,
    fileType: fileType,
    displayItemId: ids.displayItemId,
    storeId: ids.storeId,
    status: ACTIVE,
  };
}

module.exports = {
  createMasterFile,
};
