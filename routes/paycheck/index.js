const paycheck = require('./paycheck');
const { getBody, toError, sendResponse } = require('../../utils');

const onBalanceResponse = res => (err, balance) => {
    const status = err ? 500 : 200;
    const data = err ? toError(err.message) : { balance: balance.toFixed(2) };
    sendResponse(res, status, data);
};

module.exports = (req, res) => {
    if (req.method === 'GET') {
        paycheck.getBalance(onBalanceResponse(res));
    } else {
        getBody(req, (err, data) => {
            if (err) {
                sendResponse(res, 500, toError(err.message));
            } else if (data.reset) {
                paycheck.reset(data.balance, onBalanceResponse(res));
            } else if (data.amount) {
                paycheck.spend(data.amount, onBalanceResponse(res));
            } else {
                sendResponse(res, 400, toError('paycheck pay requires an amount'));
            }
        });
    }
};

module.exports.shouldRoute = req => req.hasAccess('paycheck') && /^\/paycheck/.test(req.url);
