const { connect } = require('mongodb').MongoClient;

module.exports = {
    client: null,
    getDb() {
        return connect(process.env.mongouri)
            .then(client => {
                this.client = client;
                return client.db(process.env.mongodbname);
            });
    },
    closeDb() {
        if (this.client) {
            this.client.close()
                .then(() => this.client = null);
        }
    },
    getCollection(name) {
        return this.getDb().then(db => db.collection(name));
    },
    findItemInCollection(collection, searchOptions) {
        this.getCollection(collection)
            .then(c => c.findOne(searchOptions))
            .then(obj => {
                this.closeDb();
                return obj;
            });
    },
    hasItemInCollection(collection, searchOptions) {
        return this.findItemInCollection(collection, searchOptions)
            .then(item => !!item)
            .catch(err => !!console.error('DATABASE Exception:', err));
    }
};
