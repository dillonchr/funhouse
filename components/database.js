const { connect } = require('mongodb').MongoClient;
const Errors = require('../utils/errors');

const defaultBooleanRes = (err, didSucceed) => {};

module.exports = {
    client: null,
    autoCloseDbTimer: null,
    getDb(onResponse) {
        clearTimeout(this.autoCloseDbTimer);
        this.autoCloseDbTimer = setTimeout(() => this.closeDb(), 5000);
        if (this.client) {
            onResponse(null, this.client.db(process.env.mongodbname));
        } else {
            connect(decodeURI(process.env.mongouri), (err, client) => {
                if (err) {
                    Errors.track(err);
                    onResponse(err);
                } else {
                    this.client = client;
                    onResponse(null, client.db(process.env.mongodbname));
                }
            });
        }
    },
    closeDb(onResponse = defaultBooleanRes) {
        if (this.client) {
            this.client.close(false, err => {
                if (err) {
                    Errors.track(err);
                } else {
                    this.client = null;
                }
                onResponse(err);
            });
        }
    },
    getCollection(name, onResponse) {
        this.getDb((err, db) => {
            if (err) {
                onResponse(err);
            } else {
                db.collection(name, onResponse);
            }
        })
    },
    findDocumentsInCollection(collection, search = {}, options = {}, onResponse) {
        this.getCollection(collection, (err, coll) => {
            if (err) {
                onResponse(err);
            } else {
                coll.find(search, options).toArray(onResponse);
            }
        });
    },
    getAllDocumentsInCollection(name, onResponse) {
        this.findDocumentsInCollection(name, {}, {}, onResponse);
    },
    insertMany(collection, documents, onResponse = defaultBooleanRes) {
        this.getCollection(collection, (err, coll) => {
            if (err) {
                onResponse(err);
            } else {
                coll.insertMany(documents, onResponse);
            }
        });
    },
    updateMany(collection, filter, update, onResponse = defaultBooleanRes) {
        this.getCollection(collection, (err, coll) => {
            if (err) {
                onResponse(err);
            } else {
                coll.updateMany(filter, update, onResponse);
            }
        });
    },
    replaceDocument(collection, search, document, onResponse) {
        this.getCollection(collection, (err, coll) => {
            if (err) {
                onResponse(err);
            } else {
                coll.update(search, document, onResponse);
            }
        });
    },
    findItemInCollection(collection, searchOptions, onResponse) {
        this.getCollection(collection, (err, coll) => {
            if (err) {
                onResponse(err);
            } else {
                coll.findOne(searchOptions, onResponse);
            }
        });
    },
    hasItemInCollection(collection, searchOptions, onResponse) {
        this.findItemInCollection(collection, searchOptions, (err, item) => {
            onResponse(err, !!item);
        });
    }
};
