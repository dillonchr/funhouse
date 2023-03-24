const routes = require('../routes');
const {toError} = require('../utils');

for (route of routes) {
  if (route.hasOwnProperty("init")) {
    route.init();
  }
}

module.exports = (req, res) => {
    const matchedRoute = routes.find((route) => {
        return route.shouldRoute(req);
    });
    if (matchedRoute) {
        return matchedRoute(req, res);
    }
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(toError(`no available handler for "${req.url}"`)));
};
