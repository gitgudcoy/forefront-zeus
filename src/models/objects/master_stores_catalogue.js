const {
    DataTypes, UUIDV4,
} = require('sequelize');
const { db } = require('../../config');

const MasterStoreCatalogue = db.define("MasterStoreCatalogue", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    catalogueCode: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    catalogueName: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    status: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    }
}, {
    indexes: [
        { unique: true, fields: ["catalogueCode"] },
    ],
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_store_catalogue'
});

module.exports = { MasterStoreCatalogue }
