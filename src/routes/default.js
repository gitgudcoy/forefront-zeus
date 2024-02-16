const defaultRoute = (app) => {
  app.get(`/v1/`, (req, res) => {
    return res.sendStatus(200);
  });
};

module.exports = {
  defaultRoute,
};
