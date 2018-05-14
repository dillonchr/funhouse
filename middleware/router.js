const bookmancy = require('../routes/bookmancy');
const gdq = require('../routes/gdq');
const fired = require('../routes/fired');
const inflation = require('../routes/inflation');
const paycheck = require('../routes/paycheck');
const budget = require('../routes/budget');
const cryptonics = require('../routes/cryptonics');
const dailytext = require('../routes/dailytext');
const wfh = require('../routes/wfh');
const { toError } = require('../utils');

module.exports = (req, res) => {
    if (fired.shouldRoute(req)) {
        return fired(req, res);
    }
    if (bookmancy.shouldRoute(req)) {
        return bookmancy(req, res);
    }
    if (gdq.shouldRoute(req)) {
        return gdq(req, res);
    }
    if (inflation.shouldRoute(req)) {
        return inflation(req, res);
    }
    if (paycheck.shouldRoute(req)) {
        return paycheck(req, res);
    }
    if (budget.shouldRoute(req)) {
        return budget(req, res);
    }
    if (cryptonics.shouldRoute(req)) {
        return cryptonics(req, res);
    }
    if (dailytext.shouldRoute(req)) {
        return dailytext(req, res);
    }
    if (wfh.shouldRoute(req)) {
        return wfh(req, res);
    }
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(toError(`no available handler for "${req.url}"`)));
};
