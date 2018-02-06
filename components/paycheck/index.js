const paycheck = require('./paycheck');
const getBody = require('../../utils/body');
const toError = require('../../utils/to-error');

const sendResponse = (res, status, data) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data), 'utf-8');
};

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
            } else {
                const { amount, balance, reset } = data;
                if (reset) {
                    paycheck.reset(balance, onBalanceResponse(res));
                } else if (amount) {
                    paycheck.spend(amount, onBalanceResponse(res));
                } else {
                    sendResponse(res, 400, toError('paycheck pay requires an amount'));
                }
            }
        });
    }
};