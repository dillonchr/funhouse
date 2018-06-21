const {paycheck} = require('@dillonchr/bankrupt');
const {toError, sendResponse} = require('../utils');

const onBalanceResponse = res => (err, balance) => {
    const status = err ? 500 : 200;
    const data = err ? toError(err.message) : { balance: balance.toFixed(2) };
    sendResponse(res, status, data);
};

module.exports = (req, res) => {
    if (req.method === 'GET' || !req.body) {
        paycheck.balance(onBalanceResponse(res));
    } else {
        if (req.body.reset) {
            paycheck.reset(req.body.balance, onBalanceResponse(res));
        } else if (req.body.amount) {
            paycheck.spend(req.body.amount, onBalanceResponse(res));
        } else {
            sendResponse(res, 400, toError('paycheck pay requires an amount'));
        }
    }
};

module.exports.shouldRoute = req => req.hasAccess('paycheck') && /^\/paycheck/.test(req.url);
