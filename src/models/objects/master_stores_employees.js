const { DataTypes, UUIDV4 } = require("sequelize");
const { db } = require("../../config");
const { EMPLOYEE } = require("../../variables/general");

const MasterStoreEmployees = db.define(
  "MasterStoreEmployees",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      unique: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    employeeRoles: {
      allowNull: false,
      type: DataTypes.JSON,
      defaultValue: `[${EMPLOYEE}]`,
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
    tableName: "master_store_employees",
  }
);

module.exports = { MasterStoreEmployees };
