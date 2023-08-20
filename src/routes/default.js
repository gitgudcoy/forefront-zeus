const defaultRoute = (app) => {
  app.get(
    `/v${process.env.APP_MAJOR_VERSION}/`,
    (req, res) => {
      return res.sendStatus(200);
    }
  );
};

module.exports = {
  defaultRoute,
};
