require("dotenv").config();
const express = require("express");
const { defaultRoute } = require("./src/routes/default");
const { AppConfig } = require("./src/config");
const { InitModels } = require("./src/models");
const {
  InitDistributorRoute: generalDataDistributor,
} = require("./src/routes/general-data-distributor");
const {
  InitDistributorRoute: productDataDistributor,
} = require("./src/routes/product-data-distributor");
const {
  InitDataStoringRoute,
} = require("./src/routes/data-storing");
var app = express();

// Init App configurations
app = AppConfig(app, express);

// Init DB Models
InitModels();

// Init Routes
defaultRoute(app);
generalDataDistributor(app);
productDataDistributor(app);
InitDataStoringRoute(app);

const port = process.env.PORT || 8004;
app.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});
