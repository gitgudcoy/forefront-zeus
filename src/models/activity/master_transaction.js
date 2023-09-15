const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterTransaction = db.define(
  "MasterTransaction",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    transactionCode: {
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
    paranoid: true,
    deletedAt: "destroyTime",
    tableName: "master_transaction",
  }
);

module.exports = { MasterTransaction };
