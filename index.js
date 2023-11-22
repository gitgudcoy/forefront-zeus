require("dotenv").config();
const express = require("express");
const { defaultRoute } = require("./src/routes/default");
const { AppConfig } = require("./src/config");
const {
  InitDistributorRoute: generalDataDistributor,
} = require("./src/routes/general-data-distributor");
const {
  InitDistributorRoute: productDataDistributor,
} = require("./src/routes/product-data-distributor");
const {
  InitDistributorRoute: userDataDistributor,
} = require("./src/routes/user-data-distributor");
const {
  InitDataStoringRoute: generalDataStoring,
} = require("./src/routes/general-data-storing");
const {
  InitDataStoringRoute: userDataStoring,
} = require("./src/routes/user-data-storing");
var app = express();

// Init App configurations
app = AppConfig(app, express);

// Init Routes
defaultRoute(app);
generalDataDistributor(app);
productDataDistributor(app);
userDataDistributor(app);
generalDataStoring(app);
userDataStoring(app);

const port = process.env.PORT || 8004;
app.listen(port, () => {
  console.log(`Server is up and running on ${port} ...`);
});
