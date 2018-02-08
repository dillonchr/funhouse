const getBookmancyResults = require('./bookmancy');
const { getBody, toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    getBody(req, (err, data) => {
        if (!data || !Object.keys(data).length) {
            sendResponse(res, 400, toError(err ? err.message : 'no data for search received'));
        } else {
            getBookmancyResults(data, (err, searchResults) => {
                const status = err ? 500 : 200;
                const data = err ? toError(err.message) : searchResults;
                sendResponse(res, status, data);
            });
        }
    });
};

module.exports.shouldRoute = req => /^\/books/.test(req.url);
