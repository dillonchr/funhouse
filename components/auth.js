const { db } = require('../utils');

module.exports = {
    isTokenValid(token, onResponse) {
        db.hasItemInCollection('authorized_apps', {token}, onResponse);
    }
};
