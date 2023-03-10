const {
    DataTypes,
} = require('sequelize');
const { db } = require('../../config');

const masterAddCatalogue = db.define("masterAddCatalogue", {
    userId: {
        allowNull: false,
        unique: false,
        type: DataTypes.UUID,
    },
    storeId: {
        allowNull: false,
        unique: false,
        type: DataTypes.UUID,
    }, 
    productCode: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
    },
    productName: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    status: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productType: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productDescription: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productCategory: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productDisplayCategory: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    productHashtag: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },                
    productCondition:{
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },                
    productWeight:{
        allowNull: false,
        unique: false,
        type: DataTypes.FLOAT,
    },                
    productPrices:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },                
    pickupCity:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },                
    pickupSubdistrict:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },                
    pickupWard:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },    
    pickupAddress:{   
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    pickupPostalCode:{
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },
    productMaxWaitTime:{
        allowNull: false,
        unique: false,
        type: DataTypes.INTEGER,
    },
    productMaxWaitTimePeriod:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    courierChoosen:{
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
},
    {
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'masterAddCatalogue'
    });

module.exports = {masterAddCatalogue}
