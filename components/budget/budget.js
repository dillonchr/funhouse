const db = require('../database');
const Errors = require('../../utils/errors');
const COLLECTION_NAME = 'budget';
const BASE_BUDGET = 100;

const onBalanceResponse = res => (err, user) => {
    console.log('onResponse with bal', err); 
    if (err) {
        Errors.track(err);
        res(err);
    } else {
        res(null, user.transactions.reduce((s, c) => s - c.price, BASE_BUDGET));
    }
};

const getSearch = id => ({$or:[{phone:id},{slack:id},{_id:id}]});

module.exports = {
    balance(id, onResponse) {
        db.findItemInCollection(COLLECTION_NAME, getSearch(id), onBalanceResponse(onResponse));
    },
    bought(id, transaction, onResponse) {
        db.findItemInCollection(COLLECTION_NAME, getSearch(id), (err, data) => {
            if (err) {
                Errors.track(err);
                onResponse(err);
            } else {
                data.transactions.push(transaction);
                db.replaceDocument(COLLECTION_NAME, getSearch(id), data, err => {
                    onBalanceResponse(onResponse)(err, data);
                });
            }
        });
    },
    reset(onResponse) {

    }
}