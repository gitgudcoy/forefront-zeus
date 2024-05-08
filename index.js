require("dotenv").config();
const express = require("express");
const { defaultRoute } = require("./src/routes/default");
const { AppConfig } = require("./src/config");
const {
  InitDistributorRoute: creativeStoreDataDistributor,
} = require("./src/routes/creative-store-data-distributor");
const {
  InitDistributorRoute: generalDataDistributor,
} = require("./src/routes/general-data-distributor");
const {
  InitDataStoringRoute: generalDataStorer,
} = require("./src/routes/general-data-storing");
const {
  InitDistributorRoute: productDataDistributor,
} = require("./src/routes/product-data-distributor");
const {
  InitDataPatcherRoute: productDataPatcher,
} = require("./src/routes/product-data-patcher");
const {
  InitDataCleanerRoute: productDataCleaner,
} = require("./src/routes/product-data-cleaner");
const {
  InitDistributorRoute: userDataDistributor,
} = require("./src/routes/user-data-distributor");
const {
  InitDataStoringRoute: userDataStorer,
} = require("./src/routes/user-data-storing");

const expressApp = express();

// Init App configurations
const { server, app } = AppConfig(expressApp, express);

// Init Routes
defaultRoute(app);
creativeStoreDataDistributor(app);
generalDataDistributor(app);
generalDataStorer(app);
productDataDistributor(app);
productDataPatcher(app);
productDataCleaner(app);
userDataDistributor(app);
userDataStorer(app);

const port = process.env.PORT || 8004;
server.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});
