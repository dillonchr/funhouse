const getBookmancyResults = require('./bookmancy');
const { toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        sendResponse(res, 400, toError('no data for search received'));
    } else {
        getBookmancyResults(req.body, (err, searchResults) => {
            const status = err ? 500 : 200;
            const data = err ? toError(err.message) : searchResults;
            sendResponse(res, status, data);
        });
    }
};

module.exports.shouldRoute = req => /^\/books/.test(req.url);
