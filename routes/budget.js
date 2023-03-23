const budget = require("@dillonchr/bankrupt");
const { toError, sendResponse } = require("../utils");

const onBalanceResponse = (res, balance) => {
  sendResponse(res, 200, { balance: balance.toFixed(2) });
};

module.exports = (req, res) => {
  const id = req.url.substr(req.url.lastIndexOf("/") + 1);
  if (req.method === "GET" || !req.body) {
    onBalanceResponse(res, budget.balance(id));
  } else {
    const { amount, description } = req.body;
    if (id && amount && description) {
      onBalanceResponse(res, budget.spend(id, parseFloat(amount)));
    } else {
      sendResponse(
        res,
        400,
        toError(
          `missing data for ${req.method} call to budget (id, description, amount are all required)`
        )
      );
    }
  }
};

module.exports.shouldRoute = req =>
  req.hasAccess("paycheck") && /^\/budget/.test(req.url);
