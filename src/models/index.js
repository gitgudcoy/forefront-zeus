const { db } = require("../config");
const{masterDetailKategori} = require("./kategori/master_detail_kategori");
const{masterKategori} = require("./kategori/master_kategori");
const{masterAddCatalogue} = require("./kategori/master_catalogue");

const { TIME } = require("sequelize");
//const{MasterFolder} = require("./folderPath");
const InitModels = async () => {
    masterKategori.hasMany(masterDetailKategori,{
        foreignKey: "katId",
    });
    masterDetailKategori.belongsTo(masterKategori,{
        foreignKey: "katId",
    }); 



    await db.sync({ alter: true, force: false })
        .then(() => {
            console.log("All models has been synchronized successfully.");
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            console.log("Model initialization completed");
        });
        // await masterKategori.create(
        //     { namaKategori: "VGA",id:1,katId:1 },
            
        // )
        // await masterKategori.create(
        //     { namaKategori: "CPU",id:2,katId:2}
            
        // )
       
        
        // await masterDetailKategori.bulkCreate([
        //     {id:6,nama_Barang:"VGA NVIDIA XYZ",nama_Penjual:"si penjual a",rating:4.8,price:10000,tersewa:10,kondisi:"baru",berat_Satuan:100,detail_Barang:"lorem ipsum",seller_Gesit :1,katId:1, image_1:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g" ,image_2:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g", image_3:"vvv"},
        //     {id:7,nama_Barang:"VGA NVIDIA yzx",nama_Penjual:"si penjual a",rating:4.8,price:10000,tersewa:10,kondisi:"baru",berat_Satuan:100,detail_Barang:"lorem ipsum",seller_Gesit :1,katId:1,image_1:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g"},
        //     {id:8,nama_Barang:"VGA NVIDIA YZX",nama_Penjual:"si penjual B",rating:4.8,price:10000,tersewa:10,kondisi:"baru",berat_Satuan:100,detail_Barang:"lorem ipsum",seller_Gesit :1,katId:1,image_1:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g"},
        //     {id:9,nama_Barang:"INTEL ABC",nama_Penjual:"si penjual C",rating:4.8,price:10000,tersewa:10,kondisi:"baru",berat_Satuan:100,detail_Barang:"lorem ipsum",seller_Gesit :1,katId:2,image_1:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g"},
        //     {id:10,nama_Barang:"RADEON FAFIFU",nama_Penjual:"si penjual C",rating:4.8,price:10000,tersewa:10,kondisi:"baru",berat_Satuan:100,detail_Barang:"lorem ipsum",seller_Gesit :1,katId:2,image_1:"https://images.tokopedia.net/img/cache/500-square/VqbcmM/2021/8/14/e642c4eb-e25a-474d-9619-d1c4a0f22e6a.jpg.webp?ect=4g"}
             
        // ])
}

module.exports = { InitModels
 }
