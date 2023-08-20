const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterCourier = db.define(
  "MasterCourier",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    courierName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING,
    },
  },
  {
    indexes: [{ unique: true, fields: ["courierName"] }],
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_courier",
  }
);

module.exports = { MasterCourier };
