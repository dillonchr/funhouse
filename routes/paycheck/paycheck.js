const async = require('async');
const {db} = require('../../utils');
const budget = require('../budget/budget');
const COLLECTION_NAME = 'paycheck';

const extractRemainingBalanceFromPaycheck = (paycheck) => {
    return paycheck.transactions.reduce((sum, deduction) => sum - deduction, paycheck.balance - 200)
};

module.exports = {
    getBalance(onResponse) {
        db.findItemInCollection(COLLECTION_NAME, {}, (err, paycheck) => {
            if (err) {
                onResponse(err);
            } else {
                onResponse(null, extractRemainingBalanceFromPaycheck(paycheck));
            }
        });
    },
    spend(amount, onResponse) {
        db.findItemInCollection(COLLECTION_NAME, {}, (err, paycheck) => {
            if (err) {
                onResponse(err);
            } else {
                paycheck.transactions.push(amount);
                db.replaceDocument(COLLECTION_NAME, {}, paycheck, err => {
                    if (err) {
                        onResponse(err);
                    } else {
                        onResponse(null, extractRemainingBalanceFromPaycheck(paycheck));
                    }
                });
            }
        });
    },
    reset(amount = 2736.27, onResponse) {
        const paycheck = {
            balance: amount,
            transactions: []
        };

        async.series([
            fn => db.replaceDocument(COLLECTION_NAME, {}, paycheck, fn),
            fn => budget.reset(fn)
        ], err => {
            if (err) {
                onResponse(err);
            } else {
                onResponse(null, extractRemainingBalanceFromPaycheck(paycheck));
            }
        });
    }
};
