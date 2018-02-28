const {db, errors} = require('../../utils');
const COLLECTION_NAME = 'budget';
const BASE_BUDGET = 100;

const onBalanceResponse = res => (err, user) => {
    if (!user && !err) {
        err = new Error('no budget found for requested id');
    }
    if (err) {
        errors.track(err);
        res(err);
    } else {
        res(null, user.transactions.reduce((s, c) => s - c.price, BASE_BUDGET));
    }
};

const getSearch = id => ({$or: [{phone: id}, {slack: id}, {_id: id}]});

module.exports = {
    balance(id, onResponse) {
        db.findItemInCollection(COLLECTION_NAME, getSearch(id), onBalanceResponse(onResponse));
    },
    bought(id, transaction, onResponse) {
        db.findItemInCollection(COLLECTION_NAME, getSearch(id), (err, data) => {
            if (!data && !err) {
                err = new Error(`no budget found for requested id ${id}`);
            }
            if (err) {
                errors.track(err);
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
        db.getAllDocumentsInCollection(COLLECTION_NAME, (err, docs) => {
            if (err) {
                errors.track(err);
                onResponse(err);
            } else {
                const resetDocs = docs.map(user => {
                    const balance = user.transactions.reduce((s, c) => s - c.price, BASE_BUDGET) * -1;
                    const transactions = [];
                    if (balance < 0) {
                        transactions.push({description: 'Rollover', amount: balance > 0 ? balance * -1 : 0});
                    }
                    return {...user, transactions};
                });
                resetDocs.forEach(doc => {
                    db.replaceDocument(COLLECTION_NAME, {_id: doc._id}, doc, (err) => {
                        if (err) {
                            errors.track(err);
                        }
                    });
                });
            }
        });
    }
};
