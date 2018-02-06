const gdq = require('./gdq');
const { toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    gdq((err, games) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : games;
        sendResponse(res, status, data);
    });
};

