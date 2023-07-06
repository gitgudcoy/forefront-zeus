const { db } = require("../config");
const { MasterUser } = require("./user/master_user");
const { MasterStore } = require("./objects/master_stores");
const { MasterStoreDisplayItem } = require("./objects/master_stores_display_item");
const { MasterStoreCatalogue } = require("./objects/master_stores_catalogue");
const { MasterCategory } = require("./objects/master_category");
const { MasterFile } = require("./objects/master_file");

const InitModels = async () => {

    // START ASSOCIATING
    // MasterStore - MasterUser ASSOCIATION
    MasterStore.belongsTo(MasterUser, {
        foreignKey: {
            name: "userId",
            allowNull: false
        },
        targetKey: "id"
    });
    MasterUser.hasMany(MasterStore, {
        foreignKey: {
            name: "userId",
            allowNull: false
        },
        sourceKey: "id"
    });

    // MasterStoreDisplayItem - MasterStoreCatalogue ASSOCIATION
    MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
        foreignKey: {
            name: "catalogueId",
            allowNull: false
        },
        targetKey: "id"
    });
    MasterStoreCatalogue.hasMany(MasterStoreDisplayItem, {
        foreignKey: {
            name: "catalogueId",
            allowNull: false
        },
        sourceKey: "id"
    });

    // MasterStoreDisplayItem - MasterCategory ASSOCIATION
    MasterStoreDisplayItem.belongsTo(MasterCategory, {
        foreignKey: {
            name: "categoryId",
            allowNull: false
        },
        targetKey: "id"
    });
    MasterCategory.hasMany(MasterStoreDisplayItem, {
        foreignKey: {
            name: "categoryId",
            allowNull: false
        },
        sourceKey: "id"
    });

    // MasterStore - MasterStoreCatalogue ASSOCIATION
    MasterStoreCatalogue.belongsTo(MasterStore, {
        foreignKey: {
            name: "storeId",
            allowNull: false
        },
        targetKey: "id"
    });
    MasterStore.hasMany(MasterStoreCatalogue, {
        foreignKey: {
            name: "storeId",
            allowNull: false
        },
        sourceKey: "id"
    });

    // MasterFile - MasterStoreDisplayItem ASSOCIATION
    MasterFile.belongsTo(MasterStoreDisplayItem, {
        foreignKey: {
            name: "displayItemId",
            allowNull: true
        },
        targetKey: "id"
    });
    MasterStoreDisplayItem.hasMany(MasterFile, {
        foreignKey: {
            name: "displayItemId",
            allowNull: true
        },
        sourceKey: "id"
    });
    // END OF ASSOCIATING

    await db.sync({ alter: true })
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
