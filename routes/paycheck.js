const paycheck = require("@dillonchr/bankrupt");
const { toError, sendResponse } = require("../utils");

const onBalanceResponse = (res, balance) => {
  sendResponse(res, 200, { balance: balance.toFixed(2) });
};

module.exports = (req, res) => {
  const id = req.url.substr(req.url.lastIndexOf("/") + 1);
  if (null != id) {
    if (req.method === "GET" || !req.body) {
      onBalanceResponse(res, paycheck.balance(id));
    } else {
      if (req.body.reset) {
        onBalanceResponse(res, paycheck.reset(id, req.body.balance));
      } else if (req.body.amount) {
        onBalanceResponse(res, paycheck.spend(id, req.body.amount));
      } else {
        sendResponse(res, 400, toError(`missing data for ${req.method} call to paycheck (id, description, amount are all required)`));
      }
    }
  }
};

module.exports.shouldRoute = req =>
  req.hasAccess("paycheck") && (/^\/paycheck/.test(req.url) || /^\/budget/.test(req.url));
module.exports.init = paycheck.init;
