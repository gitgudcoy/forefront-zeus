const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");
const {
  initialStoreChannelsValue,
} = require("../../variables/initialValues");

const MasterStoreDetails = db.define(
  "MasterStoreDetails",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    generalSettingsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    videoSettingsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    audioSettingsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    channelsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
      defaultValue: () => {
        return JSON.stringify(initialStoreChannelsValue());
      },
    },
    status: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_store_details",
  }
);

module.exports = { MasterStoreDetails };
