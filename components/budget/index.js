const budget = require('./budget');

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
    const [ id, amount, description ] = req.url.split('/').slice(2);
    if (amount && description) {
        budget.bought(id, {
            price: parseFloat(amount),
            description: decodeURI(description)
        }, onBalanceResponse(res));
    } else if (id) {
        budget.balance(id, onBalanceResponse(res));
    } else {
        sendResponse(res, 400, {
            error: true,
            message: 'budget requires id'
        });
    }
};
