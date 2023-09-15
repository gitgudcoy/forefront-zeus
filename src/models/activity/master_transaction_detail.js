const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");

const MasterTransactionDetail = db.define(
  "MasterTransactionDetail",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
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
    tableName: "master_transaction_detail",
  }
);

module.exports = { MasterTransactionDetail };
