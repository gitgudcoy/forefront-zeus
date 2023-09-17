const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");
const {
  initialStoreChannelsValue,
} = require("../../variables/initialValues");
const { USER } = require("../../variables/general");

const MasterStoreChannels = db.define(
  "MasterStoreChannels",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    settingsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    allowedRoles: {
      allowNull: false,
      type: DataTypes.JSON,
      defaultValue: `[${USER}]`,
    },
    channelsOrder: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    channelsJSON: {
      allowNull: true,
      type: DataTypes.JSON,
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
    tableName: "master_store_channels",
  }
);

module.exports = { MasterStoreChannels };
