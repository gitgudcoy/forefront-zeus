const { db } = require("../config");
const { MasterUser } = require("./user/master_user");
const { MasterStore } = require("./objects/master_stores");
const {
  MasterStoreDisplayItem,
} = require("./objects/master_stores_display_item");
const {
  MasterStoreCatalogue,
} = require("./objects/master_stores_catalogue");
const {
  MasterCategory,
} = require("./objects/master_category");
const {
  MasterStoreChannels,
} = require("./objects/master_stores_channels");
const {
  MasterStoreEmployees,
} = require("./objects/master_stores_employees");

const InitModels = async () => {
  // START ASSOCIATING
  // MasterStore - MasterUser ASSOCIATION
  MasterUser.hasMany(MasterStore, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });
  MasterStore.belongsTo(MasterUser, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });

  // MasterStoreEmployee - MasterStore - MasterUser ASSOCIATION
  MasterUser.hasMany(MasterStoreEmployees, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });
  MasterStoreEmployees.belongsTo(MasterUser, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStore.hasMany(MasterStoreEmployees, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });
  MasterStoreEmployees.belongsTo(MasterStore, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });

  // MasterStoreDisplayItem - MasterStoreCatalogue ASSOCIATION
  MasterStoreDisplayItem.belongsTo(MasterStoreCatalogue, {
    foreignKey: {
      name: "catalogueId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStoreCatalogue.hasMany(MasterStoreDisplayItem, {
    foreignKey: {
      name: "catalogueId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });

  // MasterStoreDisplayItem - MasterCategory ASSOCIATION
  MasterStoreDisplayItem.belongsTo(MasterCategory, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterCategory.hasMany(MasterStoreDisplayItem, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });

  // MasterStore - MasterStoreCatalogue ASSOCIATION
  MasterStoreCatalogue.belongsTo(MasterStore, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStore.hasMany(MasterStoreCatalogue, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });

  // MasterStore - MasterStoreChannels ASSOCIATION
  MasterStoreChannels.belongsTo(MasterStore, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    targetKey: "id",
    constraints: false,
  });
  MasterStore.hasMany(MasterStoreChannels, {
    foreignKey: {
      name: "storeId",
      allowNull: false,
    },
    sourceKey: "id",
    constraints: false,
  });
  // END OF ASSOCIATING

  await db
    .sync({ alter: true, force: false })
    .then(() => {
      console.log(
        "All models has been synchronized successfully."
      );
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      console.log("Model initialization completed");
    });
};

module.exports = {
  InitModels,
};
