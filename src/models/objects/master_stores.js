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
    userId: {
        allowNull: false,
        unique: false,
        type: DataTypes.UUID,
        defaultValue: null
    },
    storeCode: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
    },
    storeName: {
        allowNull: false,
        unique: true,
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
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_store'
});

module.exports = { MasterStore }
