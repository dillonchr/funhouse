const gdq = require('@dillonchr/gdq');
const {toError, sendResponse} = require('../utils');

module.exports = (req, res) => {
    gdq((err, games) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : games;
        sendResponse(res, status, data);
    });
};

module.exports.shouldRoute = req => /^\/gdq/.test(req.url);
