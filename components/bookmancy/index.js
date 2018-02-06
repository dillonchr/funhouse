const getBookmancyResults = require('./bookmancy');
const getBody = require('../../utils/body');
const toError = require('../../utils/to-error');

const sendResponse = (res, status, data) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data), 'utf-8');
};

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