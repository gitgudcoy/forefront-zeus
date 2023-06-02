
const defaultRoute = (app) => {
    app.get(`/v${process.env.APP_MAJOR_VERSION}/`, (req, res) => {

    });
}

module.exports = {
    defaultRoute
}