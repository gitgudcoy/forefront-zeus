require('dotenv').config();
const express = require("express");
const { defaultRoute } = require("./src/routes/default");
const { AppConfig } = require('./src/config');
const { InitModels } = require('./src/models');
const { InitDataDistributorRoute } = require('./src/routes/data-distributor');
const { InitDataStoringRoute } = require('./src/routes/data-storing');
var app = express();

// Init App configurations
app = AppConfig(app, express);

// Init DB Models
InitModels();

// Init Routes
defaultRoute(app);
InitDataDistributorRoute(app);
InitDataStoringRoute(app);

const port = process.env.PORT || 8004;
app.listen(port, () => {
	console.log(`Server is up and running on ${port} ...`);
});




