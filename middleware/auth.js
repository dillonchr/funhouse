const { db } = require('../utils/index');

module.exports = {
    getUser(token, onResponse) {
        db.findItemInCollection('authorized_apps', {token}, onResponse);
    }
};
