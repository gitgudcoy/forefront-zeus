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
        allowNull: false
    });
    MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
        foreignKey: "catalogueId",
        allowNull: false
    });
    MasterStoreDisplayItem.belongsTo(MasterType, {
        foreignKey: "typeId",
        allowNull: false
    });
    MasterStoreDisplayItem.belongsTo(MasterCategory, {
        foreignKey: "categoryId",
        allowNull: false
    });
    MasterStoreCatalogue.belongsTo(MasterStore, {
        foreignKey: "storeId",
        allowNull: false
    });
    // END OF ASSOCIATING

    await db.sync({ alter: true, force: false })
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
