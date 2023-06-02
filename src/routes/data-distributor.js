const { checkAuth } = require("../utils/middleware");

const InitDataDistributorRoute = (app) => {
    /*GET Method
    * ROUTE: /{version}/user/:id/stores
    * This route fetch all the user stores datasets
    */
    app.get(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores`, checkAuth, (req, res) => {
        console.log(req.session)
        return res.sendStatus(200);
    });
}

module.exports = {
    InitDataDistributorRoute
}
