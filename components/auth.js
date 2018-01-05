const db = require('./database');

const auth = {
    isTokenValid(token) {
        return db.hasItemInCollection('authorized_apps', {token});
    }
};

module.exports = auth;
