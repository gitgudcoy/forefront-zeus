const {
    DataTypes,
} = require('sequelize');
const { db } = require('../../config');



const masterKategori = db.define("masterKategori", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,        
    },
    namaKategori: {
        allowNull: false,
        type: DataTypes.STRING,
    }

    },
{
   
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'masterKategori'
});

module.exports = { masterKategori }
