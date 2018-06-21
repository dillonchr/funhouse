const inflation = require('@dillonchr/inflation');
const { toError, sendResponse } = require('../utils');

module.exports = (req, res) => {
    const [year, dollars] = req.url.split('/').slice(2);
    const status = year && dollars ? 200 : 500;
    if (year && dollars) {
        inflation(year, dollars, (err, valueThen) => {
            if (err) {
                sendResponse(res, 500, toError(err.message));
            } else {
                sendResponse(res, 200, {valueThen, valueNow: dollars, year});
            }
        });
    }
};

module.exports.shouldRoute = req => /^\/inflation/.test(req.url);
