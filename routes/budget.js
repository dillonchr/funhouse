const {budget} = require('@dillonchr/bankrupt');
const {toError, sendResponse} = require('../utils');

const onBalanceResponse = res => (err, balance) => {
    const status = err ? 500 : 200;
    const data = err ? toError(err.message) : {balance: balance.toFixed(2)};
    sendResponse(res, status, data);
};

module.exports = (req, res) => {
    const id = req.url.substr(req.url.lastIndexOf('/') + 1);
    if (req.method === 'GET' || !req.body) {
        budget.balance(id, onBalanceResponse(res));
    } else {
        const {amount, description} = req.body;
        if (id && amount && description) {
            budget.spend(id, description, parseFloat(amount), onBalanceResponse(res));
        } else {
            sendResponse(res, 400, toError(`missing data for ${req.method} call to budget (id, description, amount are all required)`));
        }
    }
};

module.exports.shouldRoute = req => req.hasAccess('paycheck') && /^\/budget/.test(req.url);
