const inflation = require('./inflation');
const { toError, sendResponse } = require('../../utils');

module.exports = (req, res) => {
    const [ year, dollars ] = req.url.split('/').slice(2);
    const status = year && dollars ? 200 : 500;
    const data = year && dollars ? {
        valueThen: inflation(dollars, year),
        valueNow: dollars,
        year
    } : toError('missing year or dollar `/inflation/year/dollars`');
    sendResponse(res, status, data);
};
