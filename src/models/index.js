const { db } = require("../config");
const { MasterStore } = require("./objects/master_stores");
const { MasterStoreDisplayItem } = require("./objects/master_stores_display_item");
const { MasterStoreCatalogue } = require("./objects/master_stores_catalogue");
const { MasterUser } = require("./user/master_user");
const { MasterType } = require("./objects/master_type");
const { MasterCategory } = require("./objects/master_category");

const InitModels = async () => {

    // START ASSOCIATING
    MasterUser.hasMany(MasterStore);
    MasterStore.belongsTo(MasterUser, {
        foreignKey: "userId",
    });

    MasterStore.hasMany(MasterStoreCatalogue);
    MasterStore.hasMany(MasterStoreDisplayItem);
    MasterStoreCatalogue.hasMany(MasterStoreDisplayItem);
    MasterStoreDisplayItem.belongsTo(MasterCategory, {
        foreignKey: "categoryId",
    });
    MasterStoreDisplayItem.belongsTo(MasterType, {
        foreignKey: "typeId",
    });
    MasterStoreDisplayItem.belongsTo(MasterStore, {
        foreignKey: "storeId",
    });
    MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
        foreignKey: "catalogueId",
    });
    MasterStoreCatalogue.belongsTo(MasterStore, {
        foreignKey: "storeId",
    });
    // END OF ASSOCIATING

    await db.sync({ alter: true, force: true })
        .then(() => {
            console.log("All models has been synchronized successfully.");
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            console.log("Model initialization completed");
        });
}

module.exports = {
    InitModels
}
