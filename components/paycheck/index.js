const paycheck = require('./paycheck');

const sendResponse = (res, status, data) => {
    res.writeHead(status, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data), 'utf-8');
};

const onBalanceResponse = res => (err, balance) => {
    const status = err ? 500 : 200;
    const data = err ? {error:true,message:err.message} : {balance:balance.toFixed(2)};
    sendResponse(res, status, data);
};

module.exports = (req, res) => {
    if (/\/paycheck\/pay/.test(req.url)) {
        const amount = (req.url.match(/[0-9.]+/) || [])[0];
        if (amount) {
            paycheck.spend(+amount, onBalanceResponse(res));
        } else {
            sendResponse(res, 400, {error:true,message:'paycheck->pay requires an amount `/pay/{n}`'});
        }
    } else if (/\/reset/.test(req.url)) {
        const balance = (req.url.match(/[0-9.]+/) || [])[0];
        paycheck.reset(balance, onBalanceResponse(res));
    } else {
        paycheck.getBalance(onBalanceResponse(res));
    }
};