const {
    DataTypes, UUIDV4,
} = require('sequelize');
const { db } = require('../../config');

const MasterStore = db.define("MasterStore", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    storeCode: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    storeName: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    storeDescription: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    storeLevel: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    storeQualityRating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    storeSpeedRating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    storeServiceRating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    status: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    }
}, {
    indexes: [
        { unique: true, fields: ["storeCode"] },
        { unique: true, fields: ["storeName"] },
        { unique: true, fields: ["userId"] },
    ],
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_store'
});

module.exports = { MasterStore }
