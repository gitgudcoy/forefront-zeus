const {
    DataTypes, UUIDV4,
} = require('sequelize');
const { db } = require('../../config');

const MasterStoreDisplayItem = db.define("MasterStoreDisplayItem", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    productCode: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    productDescription: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productCondition: {
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },
    productWeight: {
        allowNull: false,
        unique: false,
        type: DataTypes.FLOAT,
    },
    productPrices: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productRating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    pickupCity: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    pickupSubdistrict: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    pickupWard: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    pickupAddress: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    pickupPostalCode: {
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },
    productMaxWaitTime: {
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },
    productMaxWaitTimePeriod: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productHashtag: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    courierList: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    status: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
}, {
    indexes: [
        { unique: true, fields: ["productCode"] },
        { unique: true, fields: ["catalogueId"] },
        { unique: true, fields: ["typeId"] },
        { unique: true, fields: ["categoryId"] },
    ],
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_store_display_item'
});

module.exports = { MasterStoreDisplayItem }
