
const InitDataStoringRoute = (app) => {
    // POST Method
    // Route: /{version}/user/:id/stores/add
    // This route will store users new requested store, though it still need approval later
    // TODO: To ease the development, this route will set the approval status to be "APPROVE" for now
    app.post(`/v${process.env.APP_MAJOR_VERSION}/user/:id/stores/add`, async (req, res) => {

    })

}

module.exports = {
    InitDataStoringRoute
}
