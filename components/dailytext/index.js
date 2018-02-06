const dailytext = require('./dailytext');
const { toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    dailytext((err, text) => {
        const status = err ? 500 : 200;
        const data = err ? toError(err.message) : text;
        sendResponse(res, status, data);
    });
};

