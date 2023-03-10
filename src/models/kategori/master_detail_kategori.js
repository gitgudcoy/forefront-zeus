const {
    DataTypes,
    UUIDV4
} = require('sequelize');
const { db } = require('../../config');
const { USER } = require('../../variables/general');

const masterDetailKategori = db.define("masterDetailKategori", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    nama_Barang: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    nama_Penjual: {
        allowNull: false,
        unique: false,
        type: DataTypes.STRING,
    },
    rating: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 5
        }
    },
    price: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
        }
    },
    tersewa: {
        allowNull: true,
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
        }
    },
    kondisi: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    berat_Satuan: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    detail_Barang: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    seller_Gesit : {
        allowNull: true,
        type: DataTypes.BOOLEAN,
    },
    image_1 : {
        allowNull: false,
        type: DataTypes.STRING,
    },    
    image_2 : {
        allowNull: true,
        type: DataTypes.STRING,
    },
    image_3 : {
        allowNull: true,
        type: DataTypes.STRING,
    },
    image_4 : {
        allowNull: true,
        type: DataTypes.STRING,
    },
    },
    {
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'masterDetailKategori'
});
// master_User.associate = (models) => {
//     master_User.hasMany(models.master_Picture);
// };

module.exports = { masterDetailKategori}
