const fired = require('./fired');
const { toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    const call = /\/update/.test(req.url) ? fired.update : fired.list;
    call((err, results) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : results;
        sendResponse(res, status, data);
    });
};

module.exports.shouldRoute = req => /^\/fired/.test(req.url);
