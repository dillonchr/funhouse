const wfh = require('./wfh');
const {toError, sendResponse, errors} = require('../../utils');

module.exports = (req, res) => {
    wfh((err, results) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : results;
        sendResponse(res, status, data);
        if (err) {
            errors.track(err);
        }
    });
};

module.exports.shouldRoute = req => /^\/wfh/.test(req.url);
