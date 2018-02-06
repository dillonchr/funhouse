const db = require('../utils/database');

module.exports = {
    isTokenValid(token, onResponse) {
        db.hasItemInCollection('authorized_apps', {token}, onResponse);
    }
};
