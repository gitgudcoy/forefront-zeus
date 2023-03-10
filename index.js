require('dotenv').config();
const express = require("express");
const { kategoriRoute } = require("./src/routes/kategori");
const { AppConfig } = require('./src/config');
const { InitModels } = require('./src/models');

var app = express();


app = AppConfig(app, express);

InitModels();
kategoriRoute(app);



const port = 6900;

app.listen(port, () => {
	console.log(`Server is up and running on ${port} ...`);
});




