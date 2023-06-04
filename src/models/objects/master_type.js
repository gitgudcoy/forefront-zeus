const {
    DataTypes,
    UUIDV4
} = require('sequelize');
const { db } = require('../../config');

const MasterType = db.define("MasterType", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    typeName: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    },
}, {
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_type'
});

module.exports = { MasterType }
