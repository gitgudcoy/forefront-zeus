const { db } = require("../config");
const{masterDetailKategori} = require("../models/kategori/master_detail_kategori");
const{masterKategori} = require("../models/kategori/master_kategori");

const { masterAddCatalogue } = require("../models/kategori/master_catalogue");

const {
    ADDKATEGORI,
    POST_ADD_KATEGORI,
} = require('../variables/general');

const {

    UNIDENTIFIED_ERROR,

} = require('../variables/responseMessage');

const {  POSTRequest } = require('../utils/axios/post');


const kategoriRoute = (app) => {


    



    // get Method
    // Route: /{version}/dashboard/add/catalogue
    // Get all related kategori data
    app.get(`/v${process.env.APP_MAJOR_VERSION}/dashboard/add/catalogue`, async (req, res) => {
    	console.log(req.body)
        if (!req.body) return res.sendStatus(400);
        const allData = [];  
        let limits = 3 * req.body.limit ;   // number of records per page

        await masterAddCatalogue.findAll({
            limit: limits,
            offset: (req.body.limit-1) * limits               
            })
            .then((kat) => {
                   
                    allData.push(kat);  
                    console.log(allData)
                    console.log("succes")
                    return res.json({thedata : allData},).status(200);
            }).catch((err) => {
                    return res.status(501).send(err.message)
            })  
        })

    }

    

module.exports = {
    kategoriRoute
}
