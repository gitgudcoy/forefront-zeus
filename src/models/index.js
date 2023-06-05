const { db } = require("../config");
const { MasterStore } = require("./objects/master_stores");
const { MasterStoreDisplayItem } = require("./objects/master_stores_display_item");
const { MasterStoreCatalogue } = require("./objects/master_stores_catalogue");
const { MasterUser } = require("./user/master_user");
const { MasterType } = require("./objects/master_type");
const { MasterCategory } = require("./objects/master_category");

const InitModels = async () => {

    // START ASSOCIATING
    MasterStore.belongsTo(MasterUser, {
        foreignKey: "userId",
    });
    MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
        foreignKey: "catalogueId",
    });
    MasterStoreDisplayItem.belongsTo(MasterType, {
        foreignKey: "typeId",
    });
    MasterStoreDisplayItem.belongsTo(MasterCategory, {
        foreignKey: "categoryId",
    });
    MasterStoreCatalogue.belongsTo(MasterStore, {
        foreignKey: "storeId",
    });
    // END OF ASSOCIATING

    await db.sync({ alter: true, force: true })
        .then((res) => {
            console.log(res)
            console.log("All models has been synchronized successfully.");
        }).catch((err) => {
            console.log(err);
        }).finally((fin) => {
            console.log(fin)
            console.log("Model initialization completed");
        });
}

module.exports = {
    InitModels
}
