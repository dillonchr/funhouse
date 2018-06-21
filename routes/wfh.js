const wfh = require('@dillonchr/wfh');
const {toError, sendResponse, errors} = require('../utils');
const {WFH_CONN_URL, WFH_CONN_PORT, WFH_CONN_USER, WFH_CONN_PASS} = process.env;

module.exports = (req, res) => {
    wfh(WFH_CONN_URL, WFH_CONN_PORT, WFH_CONN_USER, WFH_CONN_PASS, (err, results) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : results;
        sendResponse(res, status, data);
        if (err) {
            errors.track(err);
        }
    });
};

module.exports.shouldRoute = req => /^\/wfh/.test(req.url);
