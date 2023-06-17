const { db } = require("../config");
const { MasterStore } = require("./objects/master_stores");
const { MasterStoreDisplayItem } = require("./objects/master_stores_display_item");
const { MasterStoreCatalogue } = require("./objects/master_stores_catalogue");
const { MasterUser } = require("./user/master_user");
const { MasterType } = require("./objects/master_type");
const { MasterCategory } = require("./objects/master_category");

const InitModels = async () => {

    // START ASSOCIATING
    // MasterUser.hasMany(MasterStore);
    // MasterStoreCatalogue.hasMany(MasterStoreDisplayItem);
    // MasterType.hasMany(MasterStoreDisplayItem);
    // MasterCategory.hasMany(MasterStoreDisplayItem);
    // MasterStore.hasMany(MasterStoreCatalogue);
    MasterStore.belongsTo(MasterUser, {
        foreignKey: {
            name: "userId",
            allowNull: false
        }
    });
    MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
        foreignKey: {
            name: "catalogueId",
            allowNull: false
        }
    });
    MasterStoreDisplayItem.belongsTo(MasterType, {
        foreignKey: {
            name: "typeId",
            allowNull: false
        }
    });
    MasterStoreDisplayItem.belongsTo(MasterCategory, {
        foreignKey: {
            name: "categoryId",
            allowNull: false
        }
    });
    MasterStoreCatalogue.belongsTo(MasterStore, {
        foreignKey: {
            name: "storeId",
            allowNull: false
        }
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
