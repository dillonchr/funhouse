const { db, toError, sendResponse } = require('../utils');

const getUser = (token, onResponse) => db.findItemInCollection('authorized_apps', {token}, onResponse);

module.exports = (req, res, next) => {
    getUser(req.headers['x-api-token'], (err, user) => {
        if (user) {
            req.hasAccess = n => user.access.includes('*') || user.access.includes(n);
            return next();
        }
        const status = err ? 500 : 401;
        const data = err ? toError(err.message) : toError('unauthorized');
        sendResponse(res, status, data);
    });
};
